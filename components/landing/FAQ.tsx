import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import type { FaqProps } from "@/components/landing/types";
import { cn } from "@/lib/utils";

/**
 * FAQ: accordion of questions and answers (Server Component).
 *
 * This file is a Server Component on purpose: the client boundary lives inside
 * the imported Accordion (`components/ui/accordion.tsx` is already a Client
 * Component via Radix). A Server Component importing a Client Component is valid
 * in Next.js: the interactivity is isolated to the Accordion, and FAQ adds the
 * (server-rendered) JSON-LD on top. This file must stay a Server Component.
 *
 * Visual: re-styled to the "papel anotado" surface using tokens only. Hairline
 * dividers separate items, the question uses heading type, the answer uses body
 * type. Zero hex, radius 0.
 *
 * GEO/SEO: emits a single FAQPage JSON-LD block with every Q&A mapped to a
 * Question + acceptedAnswer. This is what answer engines read, so it includes
 * ALL items, not just the visible ones.
 */
export function FAQ({ items }: FaqProps) {
  return (
    <div className="w-full">
      <JsonLd
        type="FAQPage"
        data={{
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <Accordion
        type="single"
        collapsible
        className={cn(
          "border-t border-border",
          "bg-surface text-text-primary",
        )}
      >
        {items.map((item, index) => (
          <AccordionItem
            key={`${index}-${item.question}`}
            value={`faq-${index}`}
            className="border-b border-border"
          >
            <AccordionTrigger className="py-5 font-heading text-h3 text-text-primary hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-body text-text-secondary">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
