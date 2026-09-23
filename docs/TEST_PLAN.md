# Plano de Testes — Restful-Booker Automation Framework

## 1. Contexto e objetivo

Este é um projeto de estudo que simula o ciclo completo de automação de testes de um QA
Analyst/Engenheiro de testes: planejamento, automação (UI + API), integração contínua, teste de performance e
documentação de defeitos. O objetivo não é encontrar bugs críticos em produção (a aplicação
é um ambiente público de treinamento), e sim chegar ao mais próximo como um projeto de
automação é estruturado e mantido.

**Aplicações-alvo:**

- **UI** — [Restful-Booker-Platform](https://automationintesting.online) ,
  aplicação de reserva de hotel.
- **API** — [Restful-Booker](https://restful-booker.herokuapp.com), a API de reservas
  usada isoladamente para a camada de testes de API.

## 2. Escopo

### Dentro do escopo 

- Fluxo de reserva de quarto (happy path e principais validações) — UI
- Formulário de contato — UI
- CRUD completo de reservas (criar, consultar, atualizar, remover) — API
- Autenticação e uso de token — API
- Smoke test de performance no endpoint de criação de reserva — k6
- Pipeline de CI rodando UI + API a cada push/PR

### Fora do escopo

- Painel administrativo (`/admin`) — login, gestão de quartos e mensagens
- Testes de carga completos (o k6 aqui é considerado um *smoke*, não um teste de carga real)
- Testes cross-browser 

## 3. Estratégia de testes (baseada em risco)

Com base nos estudos CTFL (Capítulo 5 - Gerenciamento de Testes) a estratégia prioriza cobertura de API (mais rápida e estável) para
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
| Painel admin                        | Baixo                            | —                       | Não é o fluxo do usuário final; entra depois                |

Segue a pirâmide de testes: a maior parte da cobertança fica na API (rápida, barata,
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

- **Ambiente:** os dois ambientes públicos de demonstração . URLs configuráveis via `.env` (`UI_BASE_URL`, `API_BASE_URL`) para permitir apontar
  para uma instância local no futuro.
- **Dados:** gerados dinamicamente em cada execução (nome, datas relativas ao dia da execução)
  para evitar dependência de estado entre execuções e permitir rodar em paralelo sem colisão.
- **Credenciais:** usuário de API de teste via variáveis de ambiente (`API_USERNAME`,
  `API_PASSWORD`), nunca hardcoded no código.

## 6. Critérios de entrada e saída

**Entrada :**
- Ambiente de execução configurado (`.env` preenchido)
- Aplicações-alvo respondendo (smoke check `GET /ping` e home da UI)

**Saída :**
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
| Documentação de bugs | Template próprio de 16 campos (ver `docs/BUG_REPORT_TEMPLATE.md`) |

## 8. Fases de execução (roadmap do projeto)

1. **Fase 1 — Fundação:** estrutura do projeto, configuração do Playwright, primeiro teste de API e de UI passando localmente.
2. **Fase 2 — Cobertura:** completar os casos de teste das seções 4 (API CRUD completo + fluxos de UI).
3. **Fase 3 — CI/CD:** pipeline no GitHub Actions com relatório publicado.
4. **Fase 4 — Performance:** smoke test com k6 integrado ao pipeline (job separado, não bloqueante).

### 8.1 Escopo atual

O script `performance/k6/booking-smoke.js` implementa um **smoke test** de
performance (não um teste de carga) contra o endpoint `POST /booking` da API
pública de demonstração `restful-booker.herokuapp.com`. O objetivo original
era detectar regressões grosseiras de latência antes que virassem incidente,
usando poucos VUs (2) e uma pausa de 3s entre iterações.

### 8.2 Limitação conhecida

Ao rodar o teste (`npm run test:perf`), a API retorna consistentemente
`HTTP 418 I'm a Teapot` para as requisições `POST /booking` originadas do k6,
mesmo com apenas 2 VUs e ~1 requisição a cada 3 segundos — um volume muito
abaixo do que caracterizaria uma rajada de tráfego real.

**Investigação realizada:**

- `GET /ping` continua respondendo `201 Created` durante todo o teste,
  descartando um bloqueio de IP genérico.
- Requisições manuais equivalentes via `curl` e via Playwright (`npm run
  test:api`) são aceitas normalmente (`200`/`201`), usando o mesmo IP e a
  mesma rede.
- A diferença observável entre essas ferramentas e o k6 é o header
  `User-Agent` (`k6/x.x.x`), o que sugere fingerprinting/bloqueio
  específico para tráfego identificado como ferramenta de teste de carga.

**Conclusão:** a API pública de demonstração aplica uma proteção
intencional contra tráfego de load testing. Isso está fora do controle do
projeto — trata-se de um recurso público e gratuito mantido por terceiros,
e contornar essa proteção (por exemplo, falsificando o `User-Agent`) não é
uma prática apropriada nem alinhada ao propósito do projeto.

### 8.3 Como o resultado deve ser interpretado

- `npm run test:perf` **não é um gate obrigatório de CI** neste projeto. Ele
  é mantido como prova de conceito / demonstração de como um teste de
  performance seria estruturado (VUs, thresholds, checks, pacing) caso o
  projeto rodasse contra um ambiente próprio ou um mock controlado.
- Um resultado com `http_req_failed` alto contra o ambiente público **é
  esperado** e não deve ser tratado como regressão do código sob teste.
- Os `thresholds` definidos no script (`p(95)<800ms`, `rate<0.01`)
  permanecem documentados como o critério que *seria* usado em um ambiente
  sob nosso controle.

### 8.4 Próximos passos (roadmap, não implementado)

- Rodar o smoke test contra uma instância própria da aplicação (self-hosted
  `restful-booker`) ou contra um mock/stub do endpoint `/booking`, eliminando
  a dependência de um serviço público compartilhado.
- Caso role uma instância própria, reavaliar os thresholds com dados reais
  de baseline.

## 9. Riscos do próprio projeto

- **Instabilidade do ambiente público de demo** — fora do nosso controle; mitigação: retries
  configurados no CI e um smoke check antes da suíte principal.
- **Mudança de layout da aplicação-alvo** — mitigação: Page Object Model isola os seletores em um
  único lugar por página.
