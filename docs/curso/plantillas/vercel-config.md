# Plantilla `.github/workflows/ci.yml` + checklist Vercel · Tendr Landing

> CI básico que cubre el 90% de bugs antes de llegar a `main`: typecheck + test + build. Auto-deploy lo hace Vercel a través de su integración nativa con GitHub, no este workflow.

---

## `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Enable corepack + pnpm
        run: |
          corepack enable
          corepack prepare pnpm@latest --activate

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ~/.local/share/pnpm/store
          key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Test
        run: pnpm test --run

      - name: Build
        run: pnpm build
        env:
          # NEXT_PUBLIC_* vars stub para que el build no falle por undefined.
          # Las reales viven en Vercel y se inyectan en su build de deploy.
          NEXT_PUBLIC_SITE_URL: https://example.com
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: 1x00000000000000000000AA
          DATABASE_URL: postgresql://stub
          TURNSTILE_SECRET_KEY: stub
          SUBSCRIBE_SALT: stub
```

**Por qué cada pieza:**

- `concurrency` cancela runs antiguos si haces push rápido a la misma rama. Ahorra minutos.
- `cache pnpm store` reduce install de 60s a 10s en runs subsiguientes.
- `--frozen-lockfile` falla si `pnpm-lock.yaml` no está actualizado. Atrapa drift.
- Las env vars del step `Build` son stubs porque el bundler de Next valida que existen, no los valores. Las reales viven en Vercel.

---

## Checklist de Vercel (antes del primer deploy a prod)

- [ ] `vercel link` ejecutado, `.vercel/project.json` generado y NO commiteado (ya está en gitignore por defecto).
- [ ] Las 5 env vars configuradas en los 3 environments (`vercel env ls`).
- [ ] BD prod en Neon (branch `prod`) creada y schema aplicado.
- [ ] `pnpm build` pasa en local con las env vars de production.
- [ ] `.vercelignore` (opcional) excluye `docs/`, `guias/`, `extractos/` si quieres builds más ligeros.

## Comandos clave

```bash
# Vincular repo con proyecto Vercel
vercel link

# Añadir env var interactiva (CLI pide el valor por stdin sin loggearlo)
vercel env add DATABASE_URL production

# Listar env vars
vercel env ls

# Primer deploy a prod
vercel deploy --prod

# Logs de la última función serverless en prod
vercel logs --prod

# Inspeccionar un deployment concreto
vercel inspect <deployment-url>
```

## Branch protection (gh api)

```bash
gh api -X PUT /repos/joseluisalmendral/tendr-landing/branches/main/protection \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```
