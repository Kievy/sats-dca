# Setup Supabase

## Variaveis do projeto

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

Nao precisa de `service_role` para o app funcionar no navegador.

## Banco de dados

Execute o SQL de `src/backend/supabase/schema.sql` no SQL Editor do Supabase.

Depois rode os scripts de apoio:

```text
src/backend/supabase/create-purchase-rpc.sql
src/backend/supabase/list-purchases-rpc.sql
src/backend/supabase/update-delete-purchase-rpc.sql
src/backend/supabase/admin-users.sql
src/backend/supabase/admin-users-role-column.sql
src/backend/supabase/privacy-username-auth.sql
```

Esse schema cria:

- `profiles`: perfil do usuario criado no cadastro.
- `assets`: ativos suportados, com `BTC` semeado inicialmente.
- `platforms`: plataformas/exchanges por usuario.
- `goals`: metas por usuario.
- `purchases`: aportes de DCA por usuario.
- RLS em todas as tabelas de usuario.
- policies para cada usuario acessar somente os proprios dados.
- trigger para criar perfil automaticamente apos cadastro.

## Auth

O app pede apenas usuario e senha. Para funcionar com Supabase Auth sem guardar email real, o usuario e convertido internamente para um email tecnico:

```text
usuario@sats-dca.app
```

No Supabase self-hosted, mantenha a confirmacao de email autoconfirmada:

```env
GOTRUE_MAILER_AUTOCONFIRM=true
```

No painel Supabase, confirme em Authentication:

- Email provider habilitado.
- Site URL em desenvolvimento pode ser `http://localhost:3000`.

## Admin

Para transformar um usuario cadastrado em admin:

```sql
update public.profiles
set role = 'admin'
where username = 'seu-usuario';
```
