# Template de Relato de Bug (16 campos)

> Modelo genérico baseado nos estudos de ctfl de 16 campos para documentar bugs encontrados durante a automação ou testes
> exploratórios neste projeto. Ajuste os campos livremente para o template real que você já usa
> no trabalho.

| # | Campo                  | Descrição                                                        |
|---|--------------------------|---------------------------------------------------------------------|
| 1 | ID                      | Identificador único do bug                          |
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

## Exemplo preenchido (Peguei como referência capitulo 5 Gerenciamento de Testes do CTFL)

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

## BUG-001 — Label do campo "Message" aponta para um id inexistente

| Campo | Valor |
|---|---|
| ID | BUG-001 |
| Título | Label do campo "Message" no formulário de contato aponta para um `id` inexistente (`for="message"` ≠ `id="description"`) |
| Data | 2026-09-23 |
| Reportado por | Brenno Alves |
| Ambiente | Demo pública (automationintesting.online) |
| Aplicação / Módulo | Restful-Booker-Platform / Formulário de contato ("Send Us a Message") |
| Navegador / Dispositivo | Chromium (Playwright); confirmado também via inspeção manual do DOM no Chrome |
| Build / Versão | N/A — ambiente de demo pública sem versionamento exposto |
| Pré-condições | Estar na página inicial, com a seção "Send Us a Message" visível |
| Passos para reproduzir | 1. Acessar a home do site. 2. Inspecionar o elemento do campo "Message" do formulário de contato (DevTools). 3. Observar o atributo `for` do `<label>` associado ao campo e o `id` real do `<textarea>` correspondente. Alternativamente, do lado da automação: rodar um teste que localiza o campo por `getByLabel('Message', { exact: true })` e preenche seu valor. |
| Resultado esperado | O `<label for="message">` deveria referenciar o `id` real do campo de mensagem, permitindo que tecnologias assistivas e locators semânticos (`getByLabel`) identifiquem o campo corretamente. |
| Resultado obtido | O label está com `for="message"`, mas o `<textarea>` real tem `id="description"` — não existe nenhum elemento com `id="message"` na página. A associação label→campo está quebrada: `getByLabel('Message', { exact: true })` nunca resolve, e o preenchimento trava até timeout (30s). |
| Severidade | Média — não impede o preenchimento manual por um usuário que clica direto no campo, mas quebra a acessibilidade via leitor de tela e a testabilidade via locators semânticos. |
| Prioridade | Baixa — site de demonstração de terceiros, sem canal de correção; documentado como achado da automação. |
| Evidências | Trecho do HTML capturado por inspeção: `<label for="message" class="form-label">Message</label>` seguido de `<textarea data-testid="ContactDescription" class="form-control" id="description" rows="5">`; trace/screenshot do Playwright mostrando o timeout em `getByLabel('Message', { exact: true })` (`tests/ui/contact-form.spec.ts`). |
| Causa raiz / Observações | Provável erro de manutenção no template do formulário — o campo parece ter sido renomeado de `id="message"` para `id="description"` em algum momento, sem atualizar o atributo `for` do label correspondente. Contornado na automação usando `page.getByTestId('ContactDescription')` (atributo estável, independente dessa inconsistência de acessibilidade). |