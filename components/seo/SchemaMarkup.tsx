interface SchemaMarkupProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders JSON-LD schema markup in a <script> tag.
 * Use once per page, pass an array for multiple schemas.
 */
export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const data = Array.isArray(schema) ? { "@context": "https://schema.org", "@graph": schema } : schema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
}
