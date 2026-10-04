/**
 * Asset demo real, anclado en Solana devnet.
 * Lo usa la landing para el playground interactivo: verificar este registro
 * contra /api/verify devuelve VERIFICADO; editar cualquier carácter → NO COINCIDE.
 * Sembrado por meditrace-video/seed-demo.mjs el 2026-10-04.
 */
export const DEMO_ASSET_ID = "AST-9E833C8303";
export const DEMO_ASSET_ADDRESS =
  "7vDQC2Qiciu2Qu4TpMwHF4XCaHzbSzrjkXKybrXR1ABT";
export const DEMO_EXPLORER_URL = `https://explorer.solana.com/address/${DEMO_ASSET_ADDRESS}?cluster=devnet`;

/** Registro PREVENTIVO (2º eslabón de la cadena). sha256 canónico abajo. */
export const DEMO_RECORD = {
  registroId: "REG-DEMO-PREV-001",
  assetId: DEMO_ASSET_ID,
  tipoEvento: "PREVENTIVO",
  resultado: "PASS",
  fechaISO: "2026-06-20T10:15:00.000Z",
  tecnicoId: "TEC-BIO-012",
  observaciones:
    "Preventivo semestral. Descarga a 200 J conforme. Seguridad eléctrica IEC 62353 conforme.",
  hashRegistroAnterior:
    "510422eebd36a5b4fe51a2949fef285032f3229faa2bf697bc84fd1a1087c8b6",
};

export const DEMO_RECORD_HASH =
  "21d259becb7e4691d4fe02a223f58dc746d98ada443ab40b1606327ba9c1671b";

export const DEMO_RECORD_JSON = JSON.stringify(DEMO_RECORD, null, 2);

/**
 * La cadena completa de 3 eventos tal como quedó sembrada en devnet.
 * Sirve como render inicial (SSR / sin JS / preview): el playground la
 * muestra al instante y la refresca en vivo contra /api/history.
 * Firmas reales del seed del 2026-10-04.
 */
export const DEMO_CHAIN = {
  assetAddress: DEMO_ASSET_ADDRESS,
  explorerUrl: DEMO_EXPLORER_URL,
  events: [
    {
      signature:
        "auPAHGPfTmr3PCvA7PPyCJ3ea6cnqxJXGEipzZkDRoSvmivzEbLoCMCbNurP3w55rbYP7wfzb1TZE13VJzhvnzb",
      blockTime: 1791117347,
      parsed: {
        assetId: DEMO_ASSET_ID,
        eventType: "ALTA",
        result: "PASS",
        recordHash:
          "510422eebd36a5b4fe51a2949fef285032f3229faa2bf697bc84fd1a1087c8b6",
        prevHash: "GENESIS",
      },
    },
    {
      signature:
        "43ZpWUFJ2Bh3VozgAuQGvZXNumpETVnHgGipchdrhuNVvkfaXprX9jLNCqXEZ1NA6Wkyi8krEBmrR4EqPuuzWHhd",
      blockTime: 1791117349,
      parsed: {
        assetId: DEMO_ASSET_ID,
        eventType: "PREVENTIVO",
        result: "PASS",
        recordHash:
          "21d259becb7e4691d4fe02a223f58dc746d98ada443ab40b1606327ba9c1671b",
        prevHash:
          "510422eebd36a5b4fe51a2949fef285032f3229faa2bf697bc84fd1a1087c8b6",
      },
    },
    {
      signature:
        "4AmzpqucnoHbTgZPv8pdTHHdNfWqfSiCr2FrbJNPaQoVZB9PBL3UjpEKJNVro7bc4k7BCbKCn5GDo6DM2938sXX8",
      blockTime: 1791117351,
      parsed: {
        assetId: DEMO_ASSET_ID,
        eventType: "CALIBRACION",
        result: "PASS",
        recordHash:
          "5b7800fbb8984e0f9ebbbdfc2716f720be261c83a0da027c4e002ea885fe2da8",
        prevHash:
          "21d259becb7e4691d4fe02a223f58dc746d98ada443ab40b1606327ba9c1671b",
      },
    },
  ],
};
