# Plantilla `robots.ts` · Tendr Landing

> Archivo `app/robots.ts` que Next.js 16 sirve en `/robots.txt`. Pilar GEO crítico: permite explícitamente a los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) que de otro modo quedarían bloqueados o ignorados.

---

## Código canónico

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tendr.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_showcase', '/api/'],
      },
      // Crawlers de IA permitidos explícitamente
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

---

## Por qué cada crawler de IA aparece en la lista

| User-agent | Operador | Qué consume |
|---|---|---|
| `GPTBot` | OpenAI | Entrenamiento de modelos GPT |
| `ChatGPT-User` | OpenAI | Búsquedas en vivo de ChatGPT (web browsing) |
| `ClaudeBot` | Anthropic | Entrenamiento de modelos Claude |
| `anthropic-ai` | Anthropic | Variante histórica, todavía activa |
| `PerplexityBot` | Perplexity | Indexación para Perplexity Answer Engine |
| `Perplexity-User` | Perplexity | Búsquedas en vivo de Perplexity |
| `Google-Extended` | Google | Entrenamiento de Gemini y AI Overviews |
| `Bytespider` | ByteDance | Entrenamiento de modelos Doubao |
| `CCBot` | Common Crawl | Dataset usado por la mayoría de LLMs open-source |

---

## Cuándo bloquear un crawler de IA

Esta plantilla los permite a todos porque la landing pública busca **maximizar citación por LLMs**. Si tu producto requiere lo contrario (por ejemplo, dominio cliente con contenido sensible), invierte la lógica:

```ts
{ userAgent: 'GPTBot', disallow: '/' },
{ userAgent: 'ClaudeBot', disallow: '/' },
// ... resto
```

---

## Verificación

Después de deploy:

```bash
curl https://<dominio>/robots.txt
```

Debe devolver el archivo con todas las líneas. La Skill de auditoría de F8 chequea que cada crawler IA está permitido.

---

## Anti-patrón frecuente

Algunos templates Next.js traen:

```ts
export default function robots() {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
```

Eso bloquea TODO. Sitio invisible para humanos y para LLMs. Cazar y reemplazar siempre que aterrices en un proyecto.
