import Link from "next/link";

import { SkipLink } from "@/components/a11y/SkipLink";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DraftNotice } from "@/components/legal/DraftNotice";
import { pageMetadata } from "@/components/seo/metadata";

export const metadata = pageMetadata({
  title: "Términos de servicio",
  description:
    "Condiciones de uso de la lista de espera de Tendr, un producto en desarrollo. Qué cubre el servicio, sus límites, la ley aplicable y el contacto.",
  path: "/terms",
});

/**
 * /terms: minimal viable terms of service (Spanish, informal "tú").
 *
 * Shell consistent with the home, /pricing and /privacy. Opens with the shared
 * <DraftNotice>: agent draft, needs human/legal review before production. The
 * applicable-law clause (Spanish law / RGPD) is stated as a draft assumption.
 */
export default function TermsPage() {
  return (
    <>
      <SkipLink />
      <Header />

      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <article className="mx-auto w-full max-w-[68ch] px-6 py-16 md:px-8 md:py-24">
          <DraftNotice />

          <h1 className="mt-10 font-heading text-h1 text-text-primary">
            Términos de servicio
          </h1>
          <p className="mt-4 text-body-lg text-text-secondary">
            Estos términos regulan tu uso de la lista de espera de Tendr. Al
            apuntarte, aceptas las condiciones que se describen a continuación.
          </p>

          <section className="mt-12 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              1. Objeto del servicio
            </h2>
            <p className="text-body text-text-secondary">
              Tendr es, por ahora, una lista de espera de un producto en
              desarrollo. Al apuntarte nos dejas tu email para avisarte cuando el
              producto esté disponible. El producto descrito en esta web todavía
              no existe como servicio activo.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              2. Apuntarse no garantiza acceso ni precio
            </h2>
            <p className="text-body text-text-secondary">
              Apuntarte a la lista de espera no garantiza que vayas a tener
              acceso al producto cuando se lance, ni asegura ningún precio,
              plazo ni funcionalidad concreta. Los planes y precios que ves son
              orientativos y pueden cambiar antes del lanzamiento.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              3. Limitación de responsabilidad
            </h2>
            <p className="text-body text-text-secondary">
              Como se trata de un producto que aún no existe, Tendr no asume
              responsabilidad por expectativas de disponibilidad, funcionalidad
              o continuidad. El servicio de lista de espera se ofrece tal cual,
              sin garantías de ningún tipo más allá de las exigidas por la ley.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              4. Ley aplicable
            </h2>
            <p className="text-body text-text-secondary">
              Como asunción de este borrador, estos términos se rigen por la
              legislación española y por el Reglamento General de Protección de
              Datos (RGPD) en lo relativo al tratamiento de datos personales. El
              tratamiento de tu email se detalla en la{" "}
              <Link
                href="/privacy"
                className="text-accent-secondary underline underline-offset-4 hover:text-text-primary"
              >
                Política de privacidad
              </Link>
              .
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              5. Contacto
            </h2>
            <p className="text-body text-text-secondary">
              Para cualquier consulta sobre estos términos puedes escribirnos a{" "}
              <a
                href="mailto:privacy@tendr.app"
                className="text-accent-secondary underline underline-offset-4 hover:text-text-primary"
              >
                privacy@tendr.app
              </a>
              . Es la misma dirección de contacto que la de privacidad y, de
              momento, un placeholder que el responsable debe sustituir por el
              correo real antes de publicar.
            </p>
          </section>

          <footer className="mt-12 border-t border-border pt-6">
            <p className="text-body-sm text-text-secondary">
              Consulta también la{" "}
              <Link
                href="/privacy"
                className="text-accent-secondary underline underline-offset-4 hover:text-text-primary"
              >
                Política de privacidad
              </Link>{" "}
              o vuelve al{" "}
              <Link
                href="/"
                className="text-accent-secondary underline underline-offset-4 hover:text-text-primary"
              >
                Inicio
              </Link>
              .
            </p>
          </footer>
        </article>
      </main>

      <Footer />
    </>
  );
}
