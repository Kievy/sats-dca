# Sats DCA

Dashboard de DCA em Bitcoin para registrar aportes, acompanhar preco medio, sats acumulados, lucro/prejuizo, metas e historico de compras.

## Stack

- Next.js 15
- React 19
- Tailwind CSS
- Supabase Auth + Postgres + RLS
- Recharts

## Funcionalidades

- Login e cadastro por usuario e senha, sem solicitar email real.
- Registro de aportes em BTC/sats com preco, valor investido, plataforma e observacoes.
- Historico de compras com filtros por periodo e plataforma.
- Dashboard com portfolio, preco atual do Bitcoin, graficos e resumo de performance.
- Metas de acumulacao em BTC.
- Area administrativa com listagem de usuarios, role e ultimo login.
- Roles `user` e `admin`.

## Requisitos

- Node.js 20 ou superior
- npm
- Uma instancia Supabase com Auth e SQL Editor disponiveis

## Variaveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia-supabase.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

Nao coloque `.env.local` no Git. Ele ja esta protegido pelo `.gitignore`.

## Instalar localmente

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Configurar Supabase

No SQL Editor do Supabase, rode os arquivos em `src/backend/supabase`.

Para uma instalacao nova, comece por:

```text
src/backend/supabase/schema.sql
```

Depois rode os scripts de apoio que garantem as funcoes atuais do app:

```text
src/backend/supabase/create-purchase-rpc.sql
src/backend/supabase/list-purchases-rpc.sql
src/backend/supabase/update-delete-purchase-rpc.sql
src/backend/supabase/admin-users.sql
src/backend/supabase/admin-users-role-column.sql
src/backend/supabase/privacy-username-auth.sql
```

Scripts opcionais:

```text
src/backend/supabase/backfill-profiles.sql
src/backend/supabase/migrate-email-users-to-username.sql
```

Use `backfill-profiles.sql` se ja existirem usuarios no Auth sem perfil em `profiles`.
Use `migrate-email-users-to-username.sql` somente se precisar migrar contas antigas que usavam email real.

## Auth sem email real

O app pede apenas usuario e senha. Internamente, para funcionar com Supabase Auth, o usuario e convertido para um email tecnico no formato:

```text
usuario@sats-dca.app
```

Em instancia self-hosted do Supabase, deixe a confirmacao de email desativada/autoconfirmada para esse fluxo:

```env
GOTRUE_MAILER_AUTOCONFIRM=true
```

## Tornar um usuario admin

Depois que o usuario fizer cadastro, rode no SQL Editor:

```sql
update public.profiles
set role = 'admin'
where username = 'seu-usuario';
```

Ao entrar novamente, a aba `Usuarios` aparece no menu apenas para admins.

## Build

```bash
npm run lint
npm run build
```

## Deploy

Configure no provedor de deploy as mesmas variaveis:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Comandos padrao:

```bash
npm install
npm run build
npm run start
```

Na Vercel, o framework Next.js costuma ser detectado automaticamente. Basta configurar as variaveis de ambiente e apontar o projeto para este repositorio.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Observacoes de seguranca

- Nunca commitar `.env.local`.
- A chave anon do Supabase deve ser usada somente com RLS ativo.
- As tabelas de usuario usam Row Level Security para isolar dados por usuario.
- A listagem de usuarios deve ser acessada apenas por perfis com `role = 'admin'`.
