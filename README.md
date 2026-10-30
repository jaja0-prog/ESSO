# ESSO v8 · Workspace privado para dois sócios

Aplicativo web responsivo, com painel, chat, fotos, anúncios, cronômetros de revisão, banco de ideias, passo a passo editável, aprendizados e **calculadora de preços**. O visual mantém o fundo fotográfico de janela chuvosa com desfoque, gotas que escorrem lentamente e a marca ESSO.

## O que mudou na v8

- **Calculadora de preços** no menu lateral: Shopee e Mercado Livre, seguindo as fórmulas de uma planilha de referência da operação, sem alterá-la.
- **Shopee:** cinco faixas configuráveis de comissão e taxa fixa; CPF/CNPJ; taxa fixa manual; adicional CPF; coparticipação estimada de frete na logística própria; imposto, embalagem, custos, margem e preço recomendado automático.
- **Mercado Livre:** tarifa editável da modalidade/categoria, taxa fixa, custo de envio pago pelo vendedor, outros encargos, imposto e margem. O tipo Clássico/Premium é informativo; informe a tarifa real do anúncio.
- **Histórico de cálculos salvos**, com nome do produto, autor, data, valores e reabertura. No modo online, os dois sócios veem o mesmo histórico.
- **Login demonstrativo** com escolha de perfil ao abrir o arquivo local. Esse modo não é seguro e não permite troca de mensagens entre dois computadores.
- **Login real via Supabase Auth** (e-mail e senha individual, sem cadastro público), disponível quando as chaves forem configuradas.

## Como abrir a demonstração

Abra `ESSO-Demonstracao-v8.html` no navegador (ou `index.html` nesta pasta). Selecione **Entrar como Você** ou **Entrar como Sócio**. Isso é uma simulação de login, não autenticação. A aplicação abre sem anúncios, mensagens ou cálculos salvos. Se você já criou dados numa versão anterior com o mesmo navegador, pode reiniciar pelo menu **Configurações → Restaurar dados de teste**; isso apaga os registros locais.

O **chat da demonstração** funciona com persistência no navegador e pode sincronizar entre abas da mesma origem, sem sair do computador. Não troque dados reais ou confidenciais nessa versão: ela não está protegida por senha.

## Login e mensagens entre dois computadores

**Não acontece automaticamente com o arquivo HTML.** Para que as mensagens saiam de um PC e apareçam no outro:

1. Crie um projeto em [Supabase](https://supabase.com/).
2. Rode o arquivo `supabase.sql` no **SQL Editor** de um projeto novo. Ele cria tabelas, políticas RLS, armazenamento privado de fotos e a publicação realtime, incluindo cálculos de preços.
3. Em **Authentication → Users**, envie convites aos dois e-mails (seu e de seu sócio). Cada pessoa cria sua própria senha. Copie os UUIDs exibidos nos dois usuários.
4. Execute no SQL Editor com os UUIDs verdadeiros:

   ```sql
   insert into public.members (user_id, display_name, role) values
     ('UUID_REAL_DO_DONO', 'Você', 'owner'),
     ('UUID_REAL_DO_SOCIO', 'Sócio', 'partner');
   ```

5. Desative **Allow new users to sign up** no provedor de e-mail do Supabase, para impedir cadastros públicos. Configure URL do site e URLs de redirecionamento dos convites.
6. No arquivo `config.js`, preencha `supabaseUrl` e `supabaseAnonKey` com os dados públicos de **Project Settings → API**. **Nunca use a chave service_role nem senhas de banco no frontend**.
7. Publique a pasta completa em uma hospedagem HTTPS (Vercel, Netlify ou Cloudflare Pages) e ajuste a URL de retorno do Supabase para o endereço publicado.
8. Entre com a conta do dono no PC A e a do sócio no PC B. Abra **Mensagens** em ambos, envie texto ou imagem e confirme a chegada em tempo real. Se a conexão realtime cair, atualizar a página recarrega o histórico persistido.

**Se seu Supabase já tem tabelas de uma versão anterior do ESSO:** execute apenas `migration_v8.sql` para acrescentar a tabela `price_calculations` e suas permissões, sem recriar as políticas existentes. Se criar um projeto novo, execute somente `supabase.sql`.

### O que cada um vai ver?

Na seção **Mensagens → Equipe ESSO**, mensagens próprias aparecem à direita, e as do outro usuário à esquerda, com nome e horário. O chat tem imagens e histórico salvos no banco. Os usuários autenticados veem as mesmas conversas. O Google Meet é um atalho externo, não chamada dentro do site. O modo online depende de configuração e publicação; esta entrega ainda não está hospedada nem conectada às suas contas.

## Calculadora: exemplos para conferir

O motor reproduz os exemplos da planilha de outubro de 2026:

- Shopee, custo R$ 22,90, margem 8%, comissão de 20% + R$ 4,50 na faixa R$ 9–79,99: **R$ 38,06**.
- Mercado Livre, custo R$ 22,90, tarifa 11,5%, envio pago pelo vendedor R$ 5,95, margem 16%: **R$ 39,80**.

As tarifas usadas na planilha são **parâmetros editáveis** e podem estar desatualizadas. Sempre confirme com o marketplace; esta calculadora não lê automaticamente a sua conta ou custos de envio. A margem aplicada é lucro / preço de venda, não acréscimo simples sobre o custo.

## Estrutura

```text
ESSO-App/
├── index.html            Tela e camadas de chuva
├── styles.css            Design, animações e responsividade
├── app.js                Navegação, chat, histórico e formulários
├── pricing-engine.js     Fórmulas testadas de Shopee e Mercado Livre
├── config.js             URLs públicas/configuração Supabase
├── supabase.sql          Instalação completa em Supabase novo
├── migration_v8.sql      Upgrade opcional de banco existente
├── assets/               Fundo de chuva desktop e mobile
├── README.md
└── LEIA-ME.txt
```

## Limitações importantes

- O chat não está publicado e **não comunica dois computadores até configurar Supabase e hospedagem**.
- No modo local, as imagens são armazenadas no navegador e podem consumir espaço; em nuvem, no bucket privado.
- Não há criptografia ponta a ponta, mensagens de áudio, chamadas incorporadas, confirmações de leitura ou notificações push.
- UpSeller e Dogama são apenas atalhos. O Google Meet abre em nova aba.
- As projeções da calculadora não garantem o repasse exato nem substituem o extrato real do marketplace.
- O histórico analítico atual organiza comparações registradas; não é um modelo de IA generativa.
