import Link from "next/link";

import { SkipLink } from "@/components/a11y/SkipLink";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DraftNotice } from "@/components/legal/DraftNotice";
import { pageMetadata } from "@/components/seo/metadata";

export const metadata = pageMetadata({
  title: "Política de privacidad",
  description:
    "Cómo trata Tendr tus datos: qué recogemos, con qué finalidad, la base legal, los proveedores implicados y los derechos que puedes ejercer.",
  path: "/privacy",
});

/**
 * /privacy: minimal-but-correct privacy policy (Spanish, informal "tú").
 *
 * Shell consistent with the home and /pricing (SkipLink + Header + main +
 * Footer). Opens with the shared <DraftNotice>: this content is an agent draft
 * and needs human/legal review before production.
 *
 * Token-only prose surface; the headings/body reuse the same type scale as the
 * FAQ. The privacy contact email is an explicit placeholder.
 */
export default function PrivacyPage() {
  return (
    <>
      <SkipLink />
      <Header />

      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <article className="mx-auto w-full max-w-[68ch] px-6 py-16 md:px-8 md:py-24">
          <DraftNotice />

          <h1 className="mt-10 font-heading text-h1 text-text-primary">
            Política de privacidad
          </h1>
          <p className="mt-4 text-body-lg text-text-secondary">
            Esta política explica cómo Tendr trata los datos personales que nos
            facilitas al apuntarte a la lista de espera. Está escrita para que la
            entiendas sin abogados de por medio.
          </p>

          <section className="mt-12 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              1. Responsable del tratamiento
            </h2>
            <p className="text-body text-text-secondary">
              El responsable del tratamiento es Tendr (nombre del proyecto).
              Puedes contactar con nosotros en materia de privacidad escribiendo
              a{" "}
              <a
                href="mailto:privacy@tendr.app"
                className="text-text-primary underline underline-offset-4 hover:text-accent-primary"
              >
                privacy@tendr.app
              </a>
              . Este correo es un placeholder: el responsable debe sustituirlo
              por la dirección real antes de publicar.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              2. Datos que recogemos
            </h2>
            <p className="text-body text-text-secondary">
              Recogemos la dirección de email que facilitas al apuntarte a la
              lista de espera. Además, guardamos un hash irreversible de tu IP
              (<span className="font-mono text-body-sm">ip_hash</span>) con la
              única finalidad de prevenir abuso y spam del formulario. No
              almacenamos tu IP en claro en ningún momento.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              3. Finalidad
            </h2>
            <p className="text-body text-text-secondary">
              Usamos tu email para gestionar la lista de espera y avisarte por
              correo del lanzamiento de Tendr. No usamos tu email para otros
              fines ni lo cedemos a terceros con fines comerciales.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              4. Base legal
            </h2>
            <p className="text-body text-text-secondary">
              La base legal es tu consentimiento explícito, que otorgas al marcar
              la casilla del formulario. Puedes retirarlo en cualquier momento
              escribiendo al email de contacto indicado arriba; retirarlo no
              afecta a la licitud del tratamiento anterior.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              5. Encargados del tratamiento y proveedores
            </h2>
            <p className="text-body text-text-secondary">
              Para prestar el servicio nos apoyamos en estos proveedores:
            </p>
            <ul className="flex flex-col gap-2 text-body text-text-secondary">
              <li>
                <span className="font-medium text-text-primary">Neon</span>: base
                de datos Postgres donde se almacena tu email.
              </li>
              <li>
                <span className="font-medium text-text-primary">Vercel</span>:
                hosting de la aplicación.
              </li>
              <li>
                <span className="font-medium text-text-primary">
                  Cloudflare Turnstile
                </span>
                : verificación anti-spam del formulario.
              </li>
            </ul>
            <p className="text-body text-text-secondary">
              Algunos proveedores pueden tratar datos fuera de la UE. En ese
              caso, la transferencia se ampara en las garantías previstas por el
              RGPD (cláusulas contractuales tipo).
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              6. Plazo de conservación
            </h2>
            <p className="text-body text-text-secondary">
              Conservamos tu email hasta el lanzamiento y el aviso
              correspondiente, o hasta que solicites su supresión, lo que ocurra
              antes.
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-text-primary">
              7. Tus derechos
            </h2>
            <p className="text-body text-text-secondary">
              Puedes ejercer tus derechos de acceso, rectificación, supresión y
              oposición escribiendo al email de privacidad indicado arriba.
              También puedes presentar una reclamación ante la autoridad de
              control competente si consideras que el tratamiento no se ajusta a
              la normativa.
            </p>
          </section>

          <footer className="mt-12 border-t border-border pt-6">
            <p className="text-body-sm text-text-secondary">
              Consulta también los{" "}
              <Link
                href="/terms"
                className="text-text-primary underline underline-offset-4 hover:text-accent-primary"
              >
                Términos de servicio
              </Link>{" "}
              o vuelve al{" "}
              <Link
                href="/"
                className="text-text-primary underline underline-offset-4 hover:text-accent-primary"
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
