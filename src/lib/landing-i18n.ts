/**
 * Diccionario ES/EN de la landing scrollytelling.
 * `es` es la fuente de verdad (voseo rioplatense); `en` está redactado en
 * inglés natural, no como traducción literal. `satisfies LandingCopy`
 * garantiza paridad de claves: si falta o sobra una clave, falla el typecheck.
 */

const es = {
  topbar: {
    openDemo: "Abrir la demo",
    openDemoShort: "Demo",
  },
  hero: {
    badge: "MEDTRC · SOLANA DEVNET",
    titleA: "Un desfibrilador falla en plena guardia.",
    titleB: "¿Cómo demostrás que se le hizo mantenimiento?",
    subBrand: "Meditrace",
    sub: "notariza cada evento del ciclo de vida de un equipo médico en Solana. El registro completo nunca sale del hospital — cualquiera puede verificarlo sin confiar en el hospital, en el proveedor del sistema ni en nosotros.",
    ctaPrimary: "Probar la demo",
    ctaVideo: "Ver el video",
    cardFileLabel: "registro.json",
    cardHashLabel: "SHA-256 · EL REGISTRO ENTERO EN 64 CARACTERES",
  },
  problem: {
    kicker: "EL PROBLEMA",
    title: "Documentar ≠ poder demostrarlo.",
    lead: "El historial de mantenimiento de un equipo médico importa cuando cruza una frontera institucional. Hoy, el que lo recibe tiene que confiar en un PDF o en la base de datos del otro.",
    cards: [
      {
        title: "Reventa de usados",
        desc: "Una clínica compra una bomba de infusión usada. ¿El historial viene completo o le borraron una reparación incómoda justo antes de la venta?",
      },
      {
        title: "Comodato y préstamos",
        desc: "El equipo se mueve entre hospitales. ¿Quién era responsable del mantenimiento en cada período?",
      },
      {
        title: "Auditoría y regulador",
        desc: "La inspección exige trazabilidad. Un PDF emitido por el propio hospital no le prueba nada a un tercero.",
      },
      {
        title: "Juicio y seguro",
        desc: "Ante un reclamo, la primera pregunta es si estos son los registros originales — o se rehicieron después.",
      },
    ],
    foot: "Argentina ya exige trazabilidad de equipos médicos en uso — los CMMS la registran; nadie puede probarla.",
  },
  flow: {
    kicker: "CÓMO FUNCIONA",
    title: "Del papel a la cadena.",
    lead: "Meditrace es una capa pública y neutra de integridad sobre el CMMS que el hospital ya usa. Una notaría de paso: no guarda nada.",
    steps: [
      {
        label: "El CMMS guarda",
        title: "El registro completo queda en el hospital",
        desc: "El CMMS guarda la orden de trabajo como siempre: técnico, mediciones, repuestos, observaciones. Nada de eso sale de su base de datos.",
      },
      {
        label: "SHA-256 local",
        title: "El hash se calcula del lado del CMMS",
        desc: "El registro se canoniza (claves ordenadas, UTF-8, sin espacios) y se hashea en el propio servidor. A Meditrace viaja solo el hash.",
      },
      {
        label: "Anclaje en Solana",
        title: "Meditrace ancla el hash — no guarda nada",
        desc: "Una transacción con memo deposita la prueba en el buzón del equipo y devuelve la firma como recibo. Meditrace es stateless: un pasamanos.",
      },
      {
        label: "Verificación abierta",
        title: "Cualquiera verifica contra la cadena",
        desc: "Quien tenga el documento recalcula el hash en su navegador y lo compara con lo anclado. Sin confiar en el hospital, en el proveedor del sistema ni en nosotros.",
      },
    ],
    storesNothing: "no guarda nada",
    memoLabel: "MEMO ON-CHAIN · DEVNET REAL",
    memoCaption: "Esto es todo lo que se hace público.",
  },
  playground: {
    kicker: "PLAYGROUND",
    title: "Probá la verificación — es real, contra devnet.",
    lead: "Este es un registro real anclado en Solana devnet. El sha256 se calcula en tu navegador: el documento nunca viaja a ningún servidor.",
    jsonLabel: "registro.json — editable",
    hashLabel: "SHA-256 EN VIVO",
    invalidJson: "JSON inválido",
    verifyButton: "Verificar contra Solana devnet",
    verifying: "Verificando…",
    verifyError: "No se pudo verificar — reintentá.",
    verifiedTitle: "VERIFICADO",
    verifiedDesc: "El documento no fue alterado desde que se ancló.",
    mismatchTitle: "NO COINCIDE",
    mismatchDesc: "El documento fue modificado o no pertenece a este equipo.",
    explorerLink: "Ver la transacción que lo prueba",
    hint: "Cambiá “200 J” por “150 J” en observaciones y verificá de nuevo.",
    restore: "Restaurar",
    chainTitle: "La cadena del equipo",
    chainLead: "Cada eslabón apunta al hash del anterior — borrar o insertar un evento rompe la cadena.",
    chainIntact: "Cadena íntegra",
    chainBroken: "Cadena ROTA",
    chainLoading: "Leyendo devnet…",
    chainError: "No se pudo leer el historial desde devnet.",
    retry: "Reintentar",
    viewTx: "ver tx",
    mailboxLabel: "Buzón on-chain",
  },
  privacy: {
    kicker: "PRIVACIDAD",
    title: "Lo público prueba. Lo privado queda adentro.",
    publicTitle: "On-chain (público, permanente)",
    privateTitle: "Se queda en el hospital",
    publicItems: [
      "ID de equipo seudónimo (AST-…)",
      "Tipo de evento (PREVENTIVO, CALIBRACIÓN…)",
      "Resultado (PASS / FAIL / PENDIENTE)",
      "SHA-256 del registro",
      "Eslabón con el evento anterior",
      "Timestamp del bloque",
    ],
    privateItems: [
      "Serie, modelo, hospital y servicio",
      "Identidad del técnico",
      "Observaciones, mediciones, repuestos",
      "El registro completo",
    ],
    modePublicName: "Público",
    modePublicDesc:
      "el memo muestra tipo de evento y resultado — transparencia para bancar una reventa.",
    modePrivateName: "Solo hash",
    modePrivateDesc:
      "el memo sale como PRIVADO · PRIVADO · hash — ni el tipo de evento se publica.",
    note: "Sin datos personales on-chain: ni técnicos ni pacientes. La exposición la decide el hospital, evento por evento.",
  },
  video: {
    kicker: "VIDEO",
    title: "La demo, de punta a punta.",
    caption: "Demo end-to-end en devnet real · 2:30",
  },
  tryit: {
    kicker: "PROBALO VOS",
    title: "Recorré la demo en 2 minutos.",
    cards: [
      {
        title: "Registrá un equipo",
        desc: "Generá un ID público seudónimo, igual que lo haría un CMMS.",
        cta: "Ir a Equipos",
      },
      {
        title: "Anclá un service",
        desc: "El evento se hashea en tu navegador y se ancla en devnet — te llevás el JSON y su QR.",
        cta: "Ir a Service",
      },
      {
        title: "Verificalo",
        desc: "En el portal público verificás el documento y ves la cadena del asset demo.",
        cta: "Ir a Verificar",
      },
    ],
  },
  footer: {
    disclaimers: [
      "Prueba la integridad del registro y su fecha de anclaje — no que el mantenimiento se haya hecho físicamente.",
      "No es firma digital (Ley 25.506): la complementa, no la reemplaza.",
      "MVP corriendo en Solana devnet.",
    ],
    built: "Construido por un ingeniero biomédico — desarrollador de MeDevice, un CMMS.",
    github: "github.com/Coriannder/meditrace-solana",
    tagline: "Pasaporte verificable del equipo médico",
  },
} as const;

/** Misma forma que `es`, pero con cada hoja como `string` (los literales de `en` difieren). */
type DeepStrings<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepStrings<U>[]
    : { readonly [K in keyof T]: DeepStrings<T[K]> };

export type LandingCopy = DeepStrings<typeof es>;
export type Lang = "es" | "en";

const en = {
  topbar: {
    openDemo: "Open the demo",
    openDemoShort: "Demo",
  },
  hero: {
    badge: "MEDTRC · SOLANA DEVNET",
    titleA: "A defibrillator fails mid-round.",
    titleB: "How do you prove it was ever maintained?",
    subBrand: "Meditrace",
    sub: "notarizes every event in a medical device's lifecycle on Solana. The full record never leaves the hospital — anyone holding the document can verify it without trusting the hospital, the software vendor, or us.",
    ctaPrimary: "Try the demo",
    ctaVideo: "Watch the video",
    cardFileLabel: "record.json",
    cardHashLabel: "SHA-256 · THE WHOLE RECORD IN 64 CHARACTERS",
  },
  problem: {
    kicker: "THE PROBLEM",
    title: "Writing it down ≠ being able to prove it.",
    lead: "A device's maintenance history matters most when it crosses an institutional boundary. Today, the receiving party has to trust a PDF — or the other side's database.",
    cards: [
      {
        title: "Buying second-hand",
        desc: "A clinic buys a used infusion pump. Is the history complete — or was an awkward repair quietly dropped right before the sale?",
      },
      {
        title: "Loans and swaps",
        desc: "Equipment moves between hospitals. Who was responsible for its upkeep during each period?",
      },
      {
        title: "Audits and regulators",
        desc: "An inspection demands traceability. A PDF issued by the hospital itself proves nothing to a third party.",
      },
      {
        title: "Courts and insurers",
        desc: "When a claim lands, the first question is whether these are the original records — or rewritten after the fact.",
      },
    ],
    foot: "Argentina already requires traceability of medical devices in use — CMMS software records it; nobody can prove it.",
  },
  flow: {
    kicker: "HOW IT WORKS",
    title: "From paper to chain.",
    lead: "Meditrace is a public, neutral integrity layer on top of the CMMS the hospital already runs. A pass-through notary: it stores nothing.",
    steps: [
      {
        label: "CMMS stores it",
        title: "The full record stays in the hospital",
        desc: "The CMMS keeps the work order as it always has: technician, readings, parts, observations. None of it leaves its database.",
      },
      {
        label: "Local SHA-256",
        title: "The hash is computed on the CMMS side",
        desc: "The record is canonicalized (sorted keys, UTF-8, no whitespace) and hashed on the hospital's own server. Only the hash ever reaches Meditrace.",
      },
      {
        label: "Anchored on Solana",
        title: "Meditrace anchors the hash — it stores nothing",
        desc: "A memo transaction deposits the proof in the device's mailbox and returns the signature as a receipt. Meditrace is stateless: a pass-through.",
      },
      {
        label: "Open verification",
        title: "Anyone can verify against the chain",
        desc: "Whoever holds the document recomputes the hash in their browser and compares it with the anchor. No trust in the hospital, the software vendor — or us.",
      },
    ],
    storesNothing: "stores nothing",
    memoLabel: "ON-CHAIN MEMO · REAL DEVNET",
    memoCaption: "This is everything that becomes public.",
  },
  playground: {
    kicker: "PLAYGROUND",
    title: "Try the verification — it's real, on devnet.",
    lead: "This is a real record anchored on Solana devnet. The sha256 is computed in your browser: the document never travels to any server.",
    jsonLabel: "record.json — editable",
    hashLabel: "LIVE SHA-256",
    invalidJson: "Invalid JSON",
    verifyButton: "Verify against Solana devnet",
    verifying: "Verifying…",
    verifyError: "Verification failed — try again.",
    verifiedTitle: "VERIFIED",
    verifiedDesc: "The document hasn't been altered since it was anchored.",
    mismatchTitle: "NO MATCH",
    mismatchDesc: "The document was modified, or it doesn't belong to this device.",
    explorerLink: "See the transaction that proves it",
    hint: "Change “200 J” to “150 J” in the observations and verify again.",
    restore: "Restore",
    chainTitle: "The device's chain",
    chainLead: "Each link points to the previous one's hash — deleting or inserting an event breaks the chain.",
    chainIntact: "Chain intact",
    chainBroken: "Broken chain",
    chainLoading: "Reading devnet…",
    chainError: "Couldn't read the history from devnet.",
    retry: "Retry",
    viewTx: "view tx",
    mailboxLabel: "On-chain mailbox",
  },
  privacy: {
    kicker: "PRIVACY",
    title: "The public half proves. The private half stays inside.",
    publicTitle: "On-chain (public, permanent)",
    privateTitle: "Stays in the hospital",
    publicItems: [
      "Pseudonymous device ID (AST-…)",
      "Event type (PREVENTIVO, CALIBRACIÓN…)",
      "Result (PASS / FAIL / PENDIENTE)",
      "SHA-256 of the record",
      "Link to the previous event",
      "Block timestamp",
    ],
    privateItems: [
      "Serial number, model, hospital, ward",
      "Technician identity",
      "Observations, readings, parts",
      "The record itself",
    ],
    modePublicName: "Public",
    modePublicDesc:
      "the memo shows event type and result — transparency to back up a resale.",
    modePrivateName: "Hash-only",
    modePrivateDesc:
      "the memo reads PRIVADO · PRIVADO · hash — not even the event type is published.",
    note: "No personal data on-chain: no technicians, no patients. Exposure is the hospital's call, event by event.",
  },
  video: {
    kicker: "VIDEO",
    title: "The demo, end to end.",
    caption: "End-to-end demo on real devnet · 2:30",
  },
  tryit: {
    kicker: "TRY IT YOURSELF",
    title: "Walk the demo in 2 minutes.",
    cards: [
      {
        title: "Register a device",
        desc: "Generate a pseudonymous public ID, just like a CMMS would.",
        cta: "Go to Devices",
      },
      {
        title: "Anchor a service",
        desc: "The event is hashed in your browser and anchored on devnet — you get the JSON and its QR.",
        cta: "Go to Service",
      },
      {
        title: "Verify it",
        desc: "In the public portal you check the document and browse the demo asset's chain.",
        cta: "Go to Verify",
      },
    ],
  },
  footer: {
    disclaimers: [
      "It proves the record's integrity and anchoring time — not that the maintenance physically happened.",
      "It's not a digital signature (Law 25.506): it complements signatures, it doesn't replace them.",
      "MVP running on Solana devnet.",
    ],
    built: "Built by a biomedical engineer — developer of MeDevice, a CMMS.",
    github: "github.com/Coriannder/meditrace-solana",
    tagline: "A verifiable passport for medical equipment",
  },
} satisfies LandingCopy;

export const LANDING_I18N: Record<Lang, LandingCopy> = { es, en };
