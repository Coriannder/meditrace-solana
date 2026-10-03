/**
 * Hashing canónico del registro — Web Crypto.
 * Corre idéntico en el navegador (crypto.subtle) y en el servidor de Next.
 * Así el CMMS puede hashear de su lado y a Meditrace le llega solo el hash.
 */

export const RECORD_FIELDS = [
  "registroId",
  "assetId",
  "tipoEvento",
  "resultado",
  "fechaISO",
  "tecnicoId",
  "observaciones",
  "hashRegistroAnterior",
] as const;

/** Valor del eslabón génesis: primer evento del activo, sin predecesor. */
export const GENESIS = "GENESIS";

/** Marca on-chain para eventos en modo "solo hash": tipo y resultado no se publican. */
export const PRIVATE_MARK = "PRIVADO";

export type Visibility = "public" | "hash-only";

/** Serialización determinística: claves ordenadas recursivamente. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys.map(
    (k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`
  );
  return `{${entries.join(",")}}`;
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Extrae solo los campos del evento (sin signature/assetAddress) antes de hashear. */
export function pickRecordFields(record: Record<string, unknown>) {
  // Se omiten los campos ausentes: un registro v1 (sin hashRegistroAnterior)
  // debe hashear igual que cuando se ancló.
  return Object.fromEntries(
    RECORD_FIELDS.filter((f) => record[f] !== undefined).map((f) => [f, record[f]])
  );
}

/** SHA-256 hex del payload del registro (campos del evento, sin metadatos de anclaje). */
export function hashRecord(payload: Record<string, unknown>): Promise<string> {
  return sha256Hex(canonicalize(payload));
}

/** assetId público seudónimo: AST- + 10 hex del sha256 de una semilla aleatoria. */
export async function generateAssetId(): Promise<string> {
  const h = await sha256Hex(`meditrace:${crypto.randomUUID()}`);
  return `AST-${h.slice(0, 10).toUpperCase()}`;
}
