import type {
  BreadcrumbList,
  FAQPage,
  Organization,
  Product,
  SoftwareApplication,
} from "schema-dts";

/**
 * Maps each supported `type` string to its schema-dts type.
 * Add an entry here to support a new schema in a type-safe way.
 */
type SchemaByType = {
  Organization: Organization;
  SoftwareApplication: SoftwareApplication;
  Product: Product;
  FAQPage: FAQPage;
  BreadcrumbList: BreadcrumbList;
};

type SupportedType = keyof SchemaByType;

/**
 * Distributes `Omit` across each member of a union so that variant-specific
 * properties survive. A plain `Omit<A | B, K>` collapses to the shared
 * properties only; schema-dts types are large unions, so we need this.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * The caller supplies the schema body without `@type` (set from the `type`
 * prop) and without `@context` (always `https://schema.org`, injected here).
 */
type SchemaData<T extends SupportedType> = DistributiveOmit<
  SchemaByType[T],
  "@type"
>;

type JsonLdProps<T extends SupportedType> = {
  type: T;
  data: SchemaData<T>;
};

/**
 * Escapes the JSON payload so it cannot break out of the <script> tag.
 * A literal `</script>` or `<!--` in any string field would otherwise close
 * the element or open a comment; encoding `<` neutralizes both.
 */
function serialize(payload: Record<string, unknown>) {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

/**
 * Emits a single JSON-LD <script> for structured data (SEO / rich results).
 * Server Component by design: this is static markup with no interactivity.
 *
 * @example
 * <JsonLd
 *   type="Organization"
 *   data={{ name: "Tendr", url: "https://tendr.app" }}
 * />
 */
export function JsonLd<T extends SupportedType>({ type, data }: JsonLdProps<T>) {
  // Type safety lives in the props (schema-dts validates `data` against
  // `type`). Building the payload is mechanical: inject the constant
  // `@context` and the `@type` from the discriminant prop. The spread is
  // cast to a plain record because `data` is a generic union; the public
  // API stays fully typed, only this internal merge is widened.
  const payload = {
    "@context": "https://schema.org",
    "@type": type,
    ...(data as Record<string, unknown>),
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be injected as raw text; React would escape entities
      // and corrupt the structured data if passed as children.
      dangerouslySetInnerHTML={{ __html: serialize(payload) }}
    />
  );
}
