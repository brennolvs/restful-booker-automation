# Plano de Testes — Restful-Booker Automation Framework

## 1. Contexto e objetivo

Este é um projeto de estudos que simula o ciclo completo de automação de testes de um QA
Analyst: planejamento, automação (UI + API), integração contínua, teste de performance e
documentação de defeitos. O objetivo não é encontrar bugs críticos em produção (a aplicação
é um ambiente público de treinamento), e sim demonstrar, de ponta a ponta, como um projeto de
automação é estruturado e mantido.

**Aplicações-alvo:**

- **UI** — [Restful-Booker-Platform](https://automationintesting.online) ,
  aplicação de reserva de hotel mantida especificamente para prática de
  automação de testes.
- **API** — [Restful-Booker](https://restful-booker.herokuapp.com), a API de reservas, 
  usada isoladamente para a camada de testes de API.

## 2. Escopo

### Dentro do escopo 

- Fluxo de reserva de quarto (principais validações) — UI
- Formulário de contato — UI
- CRUD completo de reservas (criar, consultar, atualizar, remover) — API
- Autenticação e uso de token — API
- Smoke test de performance no endpoint de criação de reserva — k6
- Pipeline de CI rodando UI + API a cada push/PR

### Fora do escopo (backlog para iterações futuras)

- Painel administrativo (`/admin`) — login, gestão de quartos e mensagens
- Testes de acessibilidade
- Testes de carga completos (o k6 aqui é teóricamente um *smoke*, não de faot um teste de carga real)
- Testes cross-browser

## 3. Estratégia de testes (baseada em risco)

A estratégia que eu resolvi utilizar prioriza cobertura de API (mais rápida e estável) para
validar regras de negócio, e reserva a UI para os fluxos que o usuário realmente percorre.

| Área                              | Risco (impacto x probabilidade) | Tipo de teste          | Por quê                                                   |
|-----------------------------------|----------------------------------|-------------------------|------------------------------------------------------------|
| Criar reserva (API)                | Alto                             | API                     | Regra de negócio central |
| Autenticação / token (API)          | Alto                             | API                     | Protege operações de escrita (update/delete)                |
| Atualizar/cancelar reserva (API)    | Alto                             | API                     | Ações irreversíveis, exigem validação de contrato           |
| Reservar um quarto (UI)             | Alto                             | E2E (UI)                | Fluxo principal do usuário final                            |
| Mensagem de contato (UI)            | Médio                            | E2E (UI)                | Fluxo secundário, mas visível ao usuário                    |
| Consultar disponibilidade (UI)      | Médio                            | E2E (UI)                | Depende de estado, risco de flakiness               |
| Performance na criação de reserva   | Médio                            | Smoke de carga (k6)      | Indício de degradação antes de virar incidente              |
| Painel admin                        | Baixo (fora do escopo da v1)     | —                       | Não é o fluxo do usuário final; entra depois                |

Fiz me baseando na pirâmide de testes: a maior parte da cobertança fica na API (rápida, barata,
estável), a UI cobre só os caminhos críticos que o usuário realmente percorre, e a performance
entra como uma camada fina de verificação, não como suíte completa.

## 4. Casos de teste

| ID      | Camada | Cenário                                                        | Prioridade |
|---------|--------|-----------------------------------------------------------------|------------|
| API-01  | API    | Health check (`GET /ping`) responde 201                         | Alta       |
| API-02  | API    | Criar reserva com dados válidos retorna `bookingid` e os dados enviados | Alta |
| API-03  | API    | Consultar reserva criada retorna os mesmos dados                | Alta       |
| API-04  | API    | Atualizar parcialmente (`PATCH`) uma reserva sem token é rejeitado (401/403) | Alta |
| API-05  | API    | Atualizar parcialmente uma reserva autenticada reflete a mudança | Alta       |
| API-06  | API    | Remover reserva autenticada retorna sucesso e a reserva some     | Alta       |
| UI-01   | UI     | Usuário visualiza os 3 quartos disponíveis na home               | Média      |
| UI-02   | UI     | Usuário reserva o quarto "Single" com datas válidas e recebe confirmação | Alta |
| UI-03   | UI     | Usuário envia mensagem pelo formulário de contato e recebe confirmação | Média |
| PERF-01 | Perf   | Criar reserva sob carga leve (smoke) mantém p95 < limite definido | Média      |

A matriz de rastreabilidade completa (caso de teste → requisito → arquivo de teste) fica junto ao
código de cada teste, como comentário `// covers: API-02`, para não duplicar manutenção em dois
lugares.

## 5. Ambientes e dados de teste

- **Ambiente:** os dois ambientes públicos de demonstração. 
  URLs configuráveis via `.env` (`UI_BASE_URL`, `API_BASE_URL`) para permitir apontar
  para uma instância local no futuro.
- **Dados:** gerados dinamicamente em cada execução (nome, datas relativas ao dia da execução)
  para evitar dependência de estado entre execuções e permitir rodar em paralelo sem colisão.
- **Credenciais:** usuário de API de teste via variáveis de ambiente (`API_USERNAME`,
  `API_PASSWORD`).

## 6. Critérios de entrada e saída

**Entrada:**
- Ambiente de execução configurado (`.env` preenchido)
- Aplicações-alvo respondendo ( `GET /ping` )

**Saída:**
- Todos os casos de teste da tabela da seção 4 implementados e passando
- Pipeline de CI verde no branch principal
- Relatório HTML publicado como artefato do CI
- README documentando como rodar localmente

## 7. Ferramentas

| Camada        | Ferramenta                              |
|---------------|-------------------------------------------|
| UI + API       | Playwright + TypeScript                   |
| CI/CD          | GitHub Actions                            |
| Performance    | Grafana k6                                |
| Relatórios     | Playwright HTML Reporter                  |
| Documentação de bugs | Template próprio de 16 campos (ver `docs/BUG_REPORT_TEMPLATE.md` ou  Capítulo 5: Gerenciamento de Testes CTFL) |

## 8. Fases de execução (roadmap do projeto)

1. **Fase 1 — Fundação:** estrutura do projeto, configuração do Playwright, primeiro teste de API e de UI passando localmente.
2. **Fase 2 — Cobertura:** completar os casos de teste das seções 4 (API CRUD completo + fluxos de UI).
3. **Fase 3 — CI/CD:** pipeline no GitHub Actions com relatório publicado.
4. **Fase 4 — Performance:** smoke test com k6 integrado ao pipeline (job separado, não bloqueante).

## 9. Riscos do próprio projeto

- **Instabilidade do ambiente público de demo** — fora do nosso controle; mitigação: retries
  configurados no CI e um smoke check antes da suíte principal.
- **Mudança de layout da aplicação-alvo** — mitigação: Page Object Model isola os seletores em um
  único lugar por página.
