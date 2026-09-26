# Henry Ford — App Mobile

App do **Henry**, assistente de manutenção preventiva para veículos Ford. O Henry identifica
sinais de desgaste no carro, explica o que está acontecendo, recomenda o serviço e já agenda na
rede oficial Ford, enviando o diagnóstico para a concessionária.

Challenge FIAP + Ford — Mobile Development and IoT (Sprint 3).

> Os dados do veículo, das concessionárias e o login são simulados. Tudo fica salvo no próprio
> aparelho com AsyncStorage.

## Rodando o projeto

Precisa de Node.js 20+ e do app **Expo Go** no celular.

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou com a câmera (iPhone). Também dá para abrir no
emulador Android apertando `a` no terminal.

Login de teste: **pedro@ford.com / henry123** (ou o botão "Usar conta de demonstração").

## Gerando o APK

O APK é gerado pelo EAS Build (na nuvem da Expo), não precisa de Android Studio.

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build -p android --profile preview
```

Quando terminar, o EAS mostra um link e um QR code para baixar o `.apk`. É só abrir no celular e
instalar (o Android pode pedir para liberar a instalação de fontes desconhecidas).

O perfil `preview` do `eas.json` gera `.apk`. O perfil `production` gera `.aab` para a Play Store.

## Testes

```bash
npm test
```

Os testes usam Jest com o preset `jest-expo/android` e o `renderRouter` do Expo Router, então
renderizam as telas reais e navegam entre elas como o usuário faria:

- login: validação dos campos, senha errada, login, sessão salva e logout;
- Henry: notificação proativa com voz, alerta, agendamento completo na rede Ford;
- agendamentos: criar, reagendar, cancelar, excluir e concluir;
- selo de manutenção: registro fora da rede pausa o selo, registro oficial reativa, valor de revenda;
- abas, cenário de saúde normal e assistente por texto/voz.

Também tem `npm run lint` e `npm run typecheck`.

## Telas

| | | | |
|:-:|:-:|:-:|:-:|
| ![Login](docs/screenshots/01-login.png) | ![Início](docs/screenshots/02-inicio.png) | ![Henry](docs/screenshots/04-notificacao-henry.png) | ![Alerta](docs/screenshots/05-alerta.png) |
| Login | Início | Aviso do Henry | Alerta |
| ![Concessionária](docs/screenshots/06-concessionaria.png) | ![Horário](docs/screenshots/07-data-horario.png) | ![Confirmação](docs/screenshots/08-confirmacao.png) | ![Agenda](docs/screenshots/09-agenda.png) |
| Concessionária | Data e horário | Confirmação | Agenda |
| ![Detalhe](docs/screenshots/10-detalhe-agendamento.png) | ![Início com alerta](docs/screenshots/11-inicio-com-alerta.png) | ![Veículo](docs/screenshots/12-veiculo.png) | ![Assistente](docs/screenshots/13-assistente-henry.png) |
| Detalhe do agendamento | Início com alerta | Veículo | Assistente |
| ![Registrar](docs/screenshots/14-registrar-manutencao.png) | ![Fora da rede](docs/screenshots/15-fora-da-rede.png) | ![Histórico](docs/screenshots/16-historico-manutencao.png) | ![Saúde normal](docs/screenshots/17-saude-normal.png) |
| Registrar manutenção | Fora da rede | Histórico e selo | Saúde normal |
| ![Perfil](docs/screenshots/18-perfil.png) | ![Apresentação](docs/screenshots/03-modo-apresentacao.png) | | |
| Perfil | Modo apresentação | | |

## Como testar os fluxos

1. **Henry avisando um problema:** na Início, toque em *Simular evento* e escolha Freios, Bateria
   ou Pneus. O Henry mostra o aviso e fala. Toque em *Sim, explicar* para ver o alerta.
2. **Agendar na rede Ford:** no alerta, *Agendar serviço Ford* → escolha a concessionária → dia
   e horário → confirme.
3. **Gerenciar agendamentos:** aba Agenda → toque no agendamento → reagendar, cancelar, marcar
   como concluído ou excluir.
4. **Selo de manutenção:** aba Veículo → *Histórico de manutenção* → *Registrar manutenção*.
   Se for em oficina externa o selo pausa e o valor de revenda cai; um serviço na rede Ford
   reativa o selo.
5. **Assistente:** aba Henry, pergunte por exemplo "Quanto vale meu carro?".
6. **Voz:** dá para desligar a voz do Henry no Perfil ou no ícone de som da aba Henry.

No Perfil tem *Restaurar dados da demo* para voltar tudo ao estado inicial.

## Estrutura

```
src/
├── app/                 rotas (Expo Router)
│   ├── _layout.tsx      stack principal e controle de login
│   ├── login.tsx
│   ├── (tabs)/          Início, Veículo, Henry, Agenda, Perfil
│   ├── alert.tsx
│   ├── demo.tsx
│   ├── off-network.tsx
│   ├── schedule/        concessionária → horário → confirmação
│   ├── booking/[id].tsx
│   └── maintenance/     histórico e cadastro
├── components/          componentes visuais reutilizados
├── data/                dados simulados (cenários, veículo, concessionárias)
├── services/            login, armazenamento local e voz
├── store/AppContext.tsx estado global
└── theme.ts             cores e espaçamentos
__tests__/               testes de integração das telas
```

## Tecnologias

Expo SDK 57, React Native 0.86, TypeScript, Expo Router, AsyncStorage, expo-speech,
expo-haptics, react-native-svg, Jest e React Native Testing Library.
