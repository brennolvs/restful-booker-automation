# Template de Relato de Bug (16 campos)

> Modelo genérico de 16 campos para documentar bugs encontrados durante a automação ou testes
> exploratórios neste projeto. Ajuste os campos livremente para o template real que você já usa
> no trabalho.

| # | Campo                  | Descrição                                                        |
|---|--------------------------|---------------------------------------------------------------------|
| 1 | ID                      | Identificador único do bug (ex: BUG-001)                            |
| 2 | Título                  | Resumo curto e objetivo do problema                                  |
| 3 | Data                    | Data em que o bug foi encontrado                                     |
| 4 | Reportado por           | Quem encontrou/registrou                                             |
| 5 | Ambiente                | Produção / homologação / demo pública, etc.                          |
| 6 | Aplicação / Módulo      | Qual sistema e qual parte dele                                       |
| 7 | Navegador / Dispositivo | Onde o problema foi observado                                        |
| 8 | Build / Versão          | Versão do sistema no momento do teste                                |
| 9 | Pré-condições           | O que precisa estar configurado antes de reproduzir                  |
| 10| Passos para reproduzir  | Passo a passo numerado                                               |
| 11| Resultado esperado      | O que deveria acontecer                                              |
| 12| Resultado obtido        | O que de fato aconteceu                                              |
| 13| Severidade              | Crítica / Alta / Média / Baixa (impacto técnico)                     |
| 14| Prioridade              | Urgente / Alta / Média / Baixa (urgência de correção)                |
| 15| Evidências              | Prints, vídeo, log, trace do Playwright                              |
| 16| Causa raiz / Observações| Hipótese de causa raiz (RCA) e observações adicionais                |

## Exemplo preenchido

| Campo | Valor |
|---|---|
| ID | BUG-001 |
| Título | Confirmação de reserva não exibe as datas corretas quando check-in e check-out estão no mesmo mês |
| Data | 2026-09-15 |
| Reportado por | Brenno Alves |
| Ambiente | Demo pública (automationintesting.online) |
| Aplicação / Módulo | Restful-Booker-Platform / Fluxo de reserva |
| Navegador / Dispositivo | Chromium (Playwright) |
| Build / Versão | restful-booker-platform v2.2 |
| Pré-condições | Quarto "Single" disponível para as datas escolhidas |
| Passos para reproduzir | 1. Acessar /reservation/1 com checkin e checkout no mesmo mês 2. Preencher dados do hóspede 3. Confirmar reserva |
| Resultado esperado | Mensagem de confirmação exibe as datas exatamente como informadas |
| Resultado obtido | (preencher ao encontrar um caso real) |
| Severidade | Média |
| Prioridade | Média |
| Evidências | anexar trace/screenshot gerado pelo Playwright em `test-results/` |
| Causa raiz / Observações | (preencher com a hipótese após investigação) |
