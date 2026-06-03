#!/usr/bin/env bash
# Bootstrap docs/curso/ desde el curriculum del programa para L16 (tendr-landing).
#
# Dos modos automáticos según desde dónde se ejecute:
#
# 1) Primera vez, desde la raíz del repo del proyecto (tendr-landing/):
#      bash "/ruta/al/curriculum/guias/modulo-5/leccion-16/bootstrap-docs-curso.sh"
#
#    El script detecta CURRICULUM desde su propia ubicación, se auto-copia a
#    scripts/bootstrap-docs-curso.sh, crea .env.local con la variable y asegura
#    que .env.local está en .gitignore. Después copia los assets a docs/curso/.
#
# 2) Refrescos posteriores (cuando el sénior actualice plantillas):
#      bash scripts/bootstrap-docs-curso.sh
#
#    El script carga CURRICULUM desde .env.local y re-copia los assets.
#
# Es idempotente en ambos modos.

set -euo pipefail

LESSON_NUM="16"
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"

# ─── Detectar modo: curriculum vs proyecto ─────────────────────────────────────
# Si el script vive junto a _planificacion/plan.md, está en el curriculum.
if [ -f "$SCRIPT_DIR/_planificacion/plan.md" ]; then
  MODE="install"
  CURRICULUM="$(cd "$SCRIPT_DIR/../../.." && pwd)"
else
  MODE="refresh"
  # Cargar .env.local del proyecto si existe (para definir CURRICULUM).
  if [ -f .env.local ]; then
    set -a
    # shellcheck disable=SC1091
    source .env.local
    set +a
  fi
fi

# ─── Validaciones ──────────────────────────────────────────────────────────────
if [ -z "${CURRICULUM:-}" ]; then
  echo "ERROR: variable CURRICULUM no definida."
  echo
  echo "Si es la primera vez, ejecuta el script desde el curriculum:"
  echo '  bash "/ruta/absoluta/al/curriculum/guias/modulo-5/leccion-16/bootstrap-docs-curso.sh"'
  echo
  echo "Si ya está instalado en scripts/, asegúrate de que .env.local contiene:"
  echo '  CURRICULUM="/ruta/absoluta/al/curriculum"'
  exit 1
fi

if [ ! -d "$CURRICULUM" ]; then
  echo "ERROR: CURRICULUM apunta a una carpeta inexistente:"
  echo "  $CURRICULUM"
  exit 1
fi

if [ ! -d "$CURRICULUM/guias/modulo-5/leccion-$LESSON_NUM" ]; then
  echo "ERROR: $CURRICULUM no parece el repo del programa."
  echo "Falta guias/modulo-5/leccion-$LESSON_NUM/."
  exit 1
fi

# ─── Modo install: auto-copia + .env.local + .gitignore ────────────────────────
if [ "$MODE" = "install" ]; then
  echo "Primera vez. Instalando en el repo del proyecto ($PWD)..."
  echo

  # Copiar el script a scripts/
  mkdir -p scripts
  cp "$SCRIPT_PATH" scripts/bootstrap-docs-curso.sh
  chmod +x scripts/bootstrap-docs-curso.sh
  echo "  ✓ scripts/bootstrap-docs-curso.sh instalado"

  # Asegurar CURRICULUM en .env.local (sin sobrescribir otras vars)
  if [ -f .env.local ] && grep -q '^CURRICULUM=' .env.local; then
    # Reemplazar línea existente
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|^CURRICULUM=.*|CURRICULUM=\"$CURRICULUM\"|" .env.local
    else
      sed -i "s|^CURRICULUM=.*|CURRICULUM=\"$CURRICULUM\"|" .env.local
    fi
    echo "  ✓ CURRICULUM actualizada en .env.local"
  else
    {
      echo ""
      echo "# Ruta absoluta al clon local del repo del programa (curriculum)."
      echo "# Usada por scripts/bootstrap-docs-curso.sh. No se commitea."
      echo "CURRICULUM=\"$CURRICULUM\""
    } >> .env.local
    echo "  ✓ CURRICULUM añadida a .env.local"
  fi

  # Asegurar .env.local en .gitignore
  if [ ! -f .gitignore ] || ! grep -qxF '.env.local' .gitignore; then
    echo ".env.local" >> .gitignore
    echo "  ✓ .env.local añadido a .gitignore"
  fi

  echo
fi

# ─── Bootstrap: copiar assets a docs/curso/ ────────────────────────────────────
echo "Copiando material del módulo desde:"
echo "  $CURRICULUM"
echo

mkdir -p docs/curso/{operacion,tecnico,plantillas,snippets}

# Lección
cp "$CURRICULUM/guias/modulo-5/leccion-16/brief.md"                docs/curso/brief.md
cp "$CURRICULUM/guias/modulo-5/leccion-16/_planificacion/plan.md"  docs/curso/plan.md

# Operación y técnico compartidos
cp "$CURRICULUM/guias/modulo-5/_compartido/operacion/produccion-del-curso.md"        docs/curso/operacion/
cp "$CURRICULUM/guias/modulo-5/_compartido/operacion/vibe-design-referencias.md"     docs/curso/operacion/
cp "$CURRICULUM/guias/modulo-5/_compartido/operacion/pipeline-extraccion-premium.md" docs/curso/operacion/
cp "$CURRICULUM/guias/modulo-5/_compartido/tecnico/preguntas-compartidas.md"         docs/curso/tecnico/

# Plantillas L16
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F1-stack-y-scaffolding/recursos/plantillas/product.md"     docs/curso/plantillas/
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F3-design-md-destilacion/recursos/plantillas/design-md.md" docs/curso/plantillas/
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F3-design-md-destilacion/recursos/plantillas/design-spec-visual.md" docs/curso/plantillas/

# Sistema visual v2 (cambio de imagen de F6) — referencia para el re-skin
cp "$CURRICULUM/guias/modulo-5/leccion-16/_rediseno-v2/design-md-tendr.md" docs/curso/design-md-v2.md
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F5-landing-v1-geo/recursos/plantillas/llms-txt.md"         docs/curso/plantillas/
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F5-landing-v1-geo/recursos/plantillas/robots-txt.md"       docs/curso/plantillas/
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F9-deploy-vercel/recursos/plantillas/tos-disclaimer.md"    docs/curso/plantillas/
cp "$CURRICULUM/guias/modulo-5/leccion-16/fases/F9-deploy-vercel/recursos/plantillas/vercel-config.md"     docs/curso/plantillas/

# Skill source para F8
rm -rf docs/curso/plantillas/skill-source
cp -R "$CURRICULUM/guias/modulo-5/leccion-16/fases/F8-skill-auditoria-multicapa/recursos/plantillas/skill-source" docs/curso/plantillas/

echo "✓ docs/curso/ listo."
echo

if [ "$MODE" = "install" ]; then
  echo "Siguiente paso: primer commit + tag clase-0."
  echo "  git add scripts/ docs/curso/ .gitignore"
  echo "  git commit -m 'docs(curso): bootstrap inicial desde modulo 5/L16'"
  echo "  git tag clase-0 && git push origin main --tags"
  echo "  gh release create clase-0 --title 'Clase 0 · Bootstrap del workspace' \\"
  echo "    --notes 'Workspace listo: scripts/bootstrap-docs-curso.sh + docs/curso/ poblado.'"
else
  echo "Siguiente paso: commit del refresh."
  echo "  git add docs/curso/"
  echo "  git commit -m 'docs(curso): sync con modulo 5/L16'"
fi
