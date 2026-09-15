# Henry Multimedia

Protótipo de **central multimídia automotiva Ford** com a inteligência embarcada **Henry**.
Simula a experiência que o motorista teria quando o Henry detecta uma possível anomalia no
veículo — do alerta preventivo ao agendamento na rede Ford, com o diagnóstico enviado
automaticamente para a concessionária.

> ⚠️ **Protótipo de apresentação.** Não há integração real com o veículo. Todos os dados são
> fictícios/mockados. Otimizado para **Samsung Galaxy Tab S10 em modo paisagem (landscape)**.

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço exibido (ex.: `http://localhost:5173`). Para produção: `npm run build` + `npm run preview`.

## Jornada principal da demo

O Henry é **proativo**: ao iniciar um cenário, ele não roda um scan — já "sabe" que há algo e
surge uma **notificação** perguntando se o motorista quer entender o problema.

`Home → Simular evento → Notificação do Henry ("percebi um sinal, quer que eu explique?") →
Sim, explicar → Alerta + Recomendação (com voz) → Agendar serviço Ford → Escolher concessionária
→ Escolher horário → Confirmar → Diagnóstico enviado à concessionária`

## Modo Apresentação

No canto superior direito há o botão **Demo** (ou **Simular evento** na Home). Ele abre o painel
de apresentação com 4 cenários controláveis:

| Cenário        | Health Score | Prioridade |
|----------------|:------------:|:----------:|
| Freios         | 72           | Média      |
| Bateria        | 61           | Alta       |
| Pneus          | 79           | Média      |
| Saúde normal   | 94           | —          |

O painel é uma ferramenta para apresentadores — não faz parte da experiência normal do motorista.

## Destaques da experiência

- **Henry proativo e com voz (nos dois sentidos)** — ao detectar uma anomalia, o Henry **fala a
  recomendação em voz alta (pt-BR, Web Speech API)** e traz o alerta até o motorista. E o
  motorista **responde por voz**: um microfone (reconhecimento de fala pt-BR) aparece na
  notificação, no alerta e no assistente. Basta dizer **"Sim" / "Explicar" / "Agendar" /
  "Agora não"** — hands-free: o mic abre sozinho assim que o Henry termina a pergunta.
  O ícone de som na barra superior liga/desliga a voz do Henry (útil na apresentação).
  > O reconhecimento de fala precisa de permissão de microfone e roda no Chrome/Edge (e no
  > Chrome do Tab S10). Em navegadores sem suporte, o mic simplesmente não aparece e os botões
  > continuam funcionando.
- **Linguagem preventiva e probabilística** — o Henry avisa sem assustar.
- **Do alerta à ação** — o Henry não apenas detecta; ele explica, recomenda e agenda.
- **Integração ponta a ponta** — animação `Veículo → Henry → Concessionária` mostrando o
  diagnóstico compartilhado. *"Você não precisa explicar o problema."*
- **Marca Henry** — a logo (mark de DNA + wordmark) integrada à barra do sistema, ao assistente
  e à navegação. Assets em `public/henry-lockup.png` e `public/henry-mark.png`.
- **Health Score** — indicadores por sistema, evolução de 30 dias e histórico do veículo.

> A voz usa o mecanismo de síntese do navegador. Após qualquer toque na tela (ex.: iniciar a
> demo), o áudio é liberado — comportamento padrão dos navegadores.

## PWA (instalável + offline)

O app é um **Progressive Web App** — pode ser instalado na tela inicial do tablet e funciona
offline após a primeira abertura.

- Manifesto `standalone`, orientação `landscape`, tema navy, ícones (incl. `maskable`).
- Service worker (Workbox via `vite-plugin-pwa`) faz precache do app shell e cache das fontes.
- Para instalar no **Galaxy Tab S10**: abra no Chrome → menu → **Instalar app / Adicionar à tela
  inicial**. O ícone do Henry aparece como um app nativo, em tela cheia e landscape.

> O service worker roda apenas no build de produção (`npm run build` + `npm run preview`) ou
> quando publicado em HTTPS — não no `npm run dev` (proposital, para evitar cache durante o
> desenvolvimento).

## Tecnologia

React · TypeScript · Vite · Tailwind CSS · lucide-react · vite-plugin-pwa (Workbox).
Sem backend — todo o estado é local.
