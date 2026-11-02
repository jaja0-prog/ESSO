# ESSO — ativação do modo online (João + Daka)

Esta versão **não permite mais entrar como demonstração**. Exibe o login real com Supabase e, sem configurar o serviço, informa o que falta. **O ZIP não contém contas reais nem banco criado**; por isso o chat não estará online até concluir os passos.

1. Crie um projeto em https://supabase.com e guarde a senha do administrador do Supabase em local seguro.
2. No painel do projeto, vá a **SQL Editor**, abra o arquivo `supabase.sql` deste pacote e execute o conteúdo inteiro **somente em projeto novo**. O SQL cria tabelas, políticas de acesso RLS e sincronização de mensagens. Se já existe um banco ESSO, não execute o SQL completo sem verificar migrações.
3. Em **Authentication > Users**, crie/convide duas contas reais com e-mails distintos: João e Daka. Configure URL do site e URLs de redirecionamento para convites e recuperação de acesso, usando a URL do seu GitHub Pages.
4. Copie o **UID** de cada uma das duas contas. Execute no SQL Editor (substitua os UUIDs pelos verdadeiros):

```sql
insert into public.members (user_id, display_name, role) values
  ('UUID_REAL_JOAO', 'João', 'owner'),
  ('UUID_REAL_DAKA', 'Daka', 'partner');
```

5. Restrinja o cadastro público no painel **Authentication**, mantendo apenas convidados autorizados.
6. Em **Project Settings > API**, copie a URL do projeto e a chave **anon/publishable** pública. Abra `config.js` e preencha `supabaseUrl` e `supabaseAnonKey`. **NUNCA use `service_role`, senhas ou tokens privados no JavaScript/GitHub.** A URL e anon key são dados públicos, e a segurança depende das políticas RLS do banco.
7. Publique os arquivos atualizados no GitHub Pages (`git add .`, `git commit -m "ESSO online"`, `git push`) e confirme o deploy na aba **Actions**.
8. Em dois computadores, João e Daka entram com seus próprios **e-mails e senhas**. Vá a **Mensagens** nos dois computadores, envie uma mensagem e verifique se ela aparece no outro. **Meu perfil** mostra o nome, o e-mail e as atividades atribuídas ao usuário logado. O painel de equipe é intencionalmente compartilhado.

## Atualizações incluídas

- Mercado Livre: comissão Dogama separada, cálculo financeiro com frete, alerta de frete zerado. Para reproduzir o exemplo, informe R$ 18,90 de custo, R$ 12,95 de frete, R$ 0,19 de comissão Dogama, 11,5% de taxa ML, habilite **Testar preço diferente** e informe R$ 25,72; o lucro será aproximadamente -R$ 9,28.
- Dogama: o atalho abre `https://dogama.com.br/app/dashboard`. Se a sessão Dogama não estiver ativa, a própria Dogama poderá pedir login. O ESSO não compartilha credenciais com a Dogama.
- Meet: ao clicar no atalho, o ESSO oferece iniciar reunião nova (OK) ou abrir a página do Meet para acessar sala existente (Cancelar). O login Google e a criação real da reunião acontecem no Google Meet.
- Ícone ESSO na aba do navegador: `assets/favicon.png`, inspirado no S metálico cortado. É uma aproximação rasterizada da identidade visual CSS, não extração exata.
- Perfil: cada pessoa autentica-se separadamente no Supabase. Dados autorais são identificados pelo UID e visíveis em **Meu perfil**; os dados da operação continuam compartilhados por padrão, não privados.

## Antes de publicar

Se já utilizou a versão antiga, **dados salvos apenas no localStorage não migram automaticamente para o Supabase**. Faça backup dos registros antigos se precisar preservá-los. Evite subir dados sensíveis ao GitHub, especialmente se o repositório for público. Não suba senhas no código. 
