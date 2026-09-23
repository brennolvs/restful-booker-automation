# Projeto Restful-Booker Automation Framework

![CI](https://github.com/brennolvs/restful-booker-automation/actions/workflows/ci.yml/badge.svg)

> Projeto de estudos criado para praticar e consolidar automação de testes com Playwright,
> aplicando as boas práticas do CTFL fora do ambiente de trabalho. Simula o ciclo completo que um
> QA Analyst percorre em um projeto real (planejamento, automação de UI e API, integração
> contínua, teste de performance e documentação de defeitos) e também serve como 
> portfólio.

> O plano de testes completo (escopo, estratégia baseada em risco, casos de teste e roadmap) está
> em [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md).

## Aplicações-alvo

| Camada | Aplicação | URL |
|---|---|---|
| UI  | Restful-Booker-Platform | https://automationintesting.online |
| API | Restful-Booker | https://restful-booker.herokuapp.com |

Ambas são aplicações públicas especificamente para prática de
automação de testes então nenhum dado real é usado ou afetado.

## Stack

- **Playwright + TypeScript** — automação de UI e API
- **GitHub Actions** — pipeline de CI
- **Grafana k6** — smoke test de performance
- **Playwright HTML Reporter** — relatório de execução

## Estrutura do projeto

```
├── docs/
│ ├── TEST_PLAN.md # Plano de testes completo
│ └── BUG_REPORT_TEMPLATE.md # Template de 16 campos para documentar bugs (baseado no capitulo 5 do CTFL)
├── src/
│ ├── pages/ # Page Object Model (UI)
│ ├── api/ # Cliente da API de reservas
│ └── fixtures/ # Fixtures customizadas do Playwright
├── tests/
│ ├── ui/ # Testes end-to-end
│ └── api/ # Testes de API
├── performance/k6/ # Smoke test de performance
└── .github/workflows/ # Pipeline de CI
```


## Como rodar localmente

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env

npm test              # roda tudo (UI + API)
npm run test:ui        # só os testes de UI
npm run test:api       # só os testes de API
npm run report         # abre o relatório HTML da última execução
```

Para o smoke test de performance (requer [k6](https://k6.io/docs/get-started/installation/) instalado):

```bash
npm run test:perf
```
- `npm run test:perf`: smoke test de performance via k6 (prova de conceito). **Não roda no CI** — da uma olhada `docs/TEST_PLAN.md` seção 8.3 para a limitação conhecida (a API pública de demo bloqueia tráfego do k6 com `418`).

## CI/CD

Todo push ou pull request para `main` dispara o workflow `.github/workflows/ci.yml`, que
instala as dependências, roda a suíte completa (UI + API) e publica o relatório HTML no
GitHub Pages — sempre com o resultado da última execução, sem precisar baixar nada:

**[Ver último relatório de testes](https://brennolvs.github.io/restful-booker-automation/)**

Detalhes do pipeline (jobs, permissões, limitações conhecidas de rede) em
[`docs/TEST_PLAN.md`](docs/TEST_PLAN.md#9-cicd).

## Roadmap

Veja a seção "Fases de execução" do [plano de testes](docs/TEST_PLAN.md#8-fases-de-execução-roadmap-do-projeto)
para o que já está implementado e o que vem a seguir.

## Autor

Brenno Alves — QA Analyst (Pleno) — [github.com/brennolvs](https://github.com/brennolvs)