# EcoTrack

Aplicação web para registrar e acompanhar ações sustentáveis do dia a dia. O EcoTrack ajuda a organizar iniciativas como reciclagem, descarte correto, economia de água e energia, mobilidade sustentável e consumo consciente.

**Aplicação publicada:** https://gabhideki.github.io/EcoTrack/  
**Repositório:** https://github.com/GabHideki/EcoTrack

## Equipe

- **Equipe:** EcoTrack
- **Integrantes:** Gabriel Hideki de Almeida Yamamoto
- **Disciplina:** ES46B - Gerência De Configuração E Manutenção De Software
- **Turma:** ES61

## Funcionalidades

- Registrar uma ação com descrição, categoria e data.
- Validar a descrição, a categoria escolhida e a data.
- Consultar o histórico e filtrar ações por categoria.
- Excluir registros.
- Ver o total de ações, a categoria mais registrada e o número de ações dos últimos sete dias.

Os registros são armazenados no navegador usando `localStorage`.

## Tecnologias

- HTML, CSS e JavaScript com módulos ES.
- Node.js 24 e Node Test Runner para testes e build.
- Git e GitHub para versionamento e hospedagem do repositório.
- GitHub Actions para automação de testes, build e publicação.
- GitHub Pages para hospedar a aplicação.

## Como executar

É possível abrir a aplicação localmente com um servidor estático, como a extensão **Live Server** do Visual Studio Code. Inicie o servidor na pasta do projeto e abra o endereço local fornecido pela extensão.

Para executar os testes e preparar os arquivos de publicação, abra o terminal na raiz do projeto e rode:

```bash
npm test
npm run build
```

O build prepara os arquivos dentro da pasta `dist/`.

## Testes automatizados

O comando `npm test` executa quatro testes em `tests/actions.test.js`:

1. Verifica a validação da ação e a remoção de espaços extras na descrição.
2. Verifica a rejeição de descrição curta e categoria inválida.
3. Verifica o cadastro de uma ação sustentável.
4. Verifica o filtro de ações por categoria.

## Pipeline de CI e entrega

O workflow está em `.github/workflows/ci.yml`. Ele é acionado em envios de código e pull requests.

O job `validar` executa os testes, gera a pasta `dist/` e prepara o artefato do GitHub Pages. O job `publicar` depende da aprovação de `validar` e só é executado após um envio válido à branch `main`. Assim, uma falha nos testes ou no build impede a publicação. Pull requests são verificadas, mas não publicam o site.

## Limitações conhecidas

- Os dados ficam apenas no navegador em que foram registrados.
- Não há sincronização entre dispositivos ou entre usuários.
- O projeto não possui autenticação, servidor próprio ou banco de dados remoto.
- Os resumos contam registros, mas não calculam métricas ambientais de impacto.