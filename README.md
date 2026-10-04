# Meditrace

**A verifiable passport for medical equipment — built on Solana.**

Meditrace is a notarization microservice that any hospital maintenance system (CMMS) can plug into. Every lifecycle event of a medical device — installation, preventive maintenance, repair, calibration, transfer, decommission — gets a tamper-evident fingerprint anchored on Solana. The full record never leaves the hospital. Anyone holding the document can verify it, without trusting the hospital, the software vendor, or us.

> Status: working MVP on **Solana devnet** · [Demo video](public/demo.mp4)

---

## The problem

Medical equipment carries a long paper trail: work orders, calibration certificates, electrical-safety tests, transfer records. That history matters most when it **crosses an institutional boundary**:

- a clinic **buys a used** infusion pump or ventilator,
- equipment moves between hospitals under **loan / swap agreements**,
- an **auditor or regulator** inspects maintenance compliance,
- an **insurer or a court** needs to know what happened, and when.

Today the receiving party has to trust a PDF or the other institution's database. Records can be backfilled, edited, or silently dropped (for example, an inconvenient repair right before a sale). Nobody outside the institution can prove the history is complete and unaltered.

Argentina already requires traceability of active medical devices in use ([national traceability regime](https://www.argentina.gob.ar/normativa/nacional/norma-224109/texto)). Local CMMS products track this history, but none of them make it independently verifiable.

## The solution

Meditrace adds a **public, neutral integrity layer** on top of existing CMMS software:

1. The CMMS keeps the full record, as it does today.
2. It computes the record's SHA-256 hash **on its own side** and sends **only the hash** to Meditrace.
3. Meditrace anchors the hash on Solana and returns the transaction signature as a receipt.
4. Anyone with the document can recompute the hash and compare it with the chain.

Meditrace stores nothing. It is a pass-through notary.

```
┌──────────────┐  hash only   ┌──────────────────┐  memo tx   ┌────────────┐
│  CMMS        │ ───────────▶ │  Meditrace API   │ ─────────▶ │  Solana    │
│  (hospital)  │ ◀─────────── │  (stateless)     │ ◀───────── │            │
│  full record │  signature   └──────────────────┘            └─────┬──────┘
└──────────────┘                                                    │ read
                                                                    ▼
                                             ┌────────────────────────────────┐
                                             │ Public verification portal     │
                                             │ (auditor / buyer / inspector)  │
                                             │ hash computed in the browser   │
                                             └────────────────────────────────┘
```

## What is public and what is private

| On-chain (public, permanent) | Off-chain (stays in the CMMS) |
|---|---|
| Pseudonymous asset ID (`AST-2ADBF9C13D`) | Real serial number, model, hospital, ward |
| Event type (`PREVENTIVO`, `CALIBRACION`, …) | Technician identity |
| Result (`PASS` / `FAIL` / `PENDIENTE`) | Observations, measurements, parts |
| SHA-256 of the full record | The record itself |
| Link to the previous event's hash | — |
| Block timestamp (set by Solana) | — |

- **No personal data goes on-chain**: no technician names, no patients.
- **Pseudonymous IDs**: the public asset ID cannot be traced back to a hospital or device. Only the owner holds the mapping, and reveals it when it chooses to (to a buyer, an auditor).
- **Corrections are appended, never edited**: a correction is a new event, which is how regulated audit trails already work.

### Exposure is decided by the hospital

A public `FAIL` or `INCIDENTE` can affect an institution's reputation even under a pseudonym. So each event is anchored in one of two modes, chosen by the CMMS:

| Mode | Public memo | Use case |
|---|---|---|
| `public` (default) | `PREVENTIVO · PASS · hash` | Transparency, e.g. to support a resale |
| `hash-only` | `PRIVADO · PRIVADO · hash` | Do not reveal event types or results |

In `hash-only` mode the CMMS does not even send the event type or result to Meditrace. Document verification and chain integrity work the same in both modes.

## Two kinds of tampering, both detected

**1. Altering a document.** Change a single character and the SHA-256 no longer matches the anchored hash → `NO COINCIDE`.

**2. Deleting or inserting an event.** Each record includes `hashRegistroAnterior`, the hash of the previous event of the same asset. Removing an inconvenient repair from the middle of the history breaks the chain → `Cadena ROTA`.

Both checks apply to **anchored** events. An event that was never anchored cannot be detected as missing.

The chain is **per asset, not per hospital**. The history can travel with the device when it is sold or transferred, as long as the seller hands over the public asset ID and the buyer keeps anchoring under it.

## Disputes and legal proceedings

When equipment is involved in a dispute, the first question is usually: *are these maintenance records the originals?* Meditrace takes that question off the table. It provides **verifiable evidence of document integrity and timing** that a technical expert (for example, a clinical engineering perito) can explain and that anyone can reproduce.

| Situation | How Meditrace helps |
|---|---|
| **Patient harm / malpractice claim** involving a device (infusion pump, defibrillator, electrosurgical unit) | Shows that the calibration and electrical-safety records presented are the ones recorded at the time, not edited afterwards |
| **Conflicting versions** of a record (CMMS vs. paper) | The anchored hash identifies which version is the original |
| **Service provider liability** | Records what was reported and repaired, and when |
| **SLA disputes** (repair times, penalties) | The block timestamp fixes when each work order was closed |
| **Warranty claims** | Rebuts "no maintenance was done" with anchored records |
| **Loan / swap agreements** | Proves when custody changed, which matters for who is responsible in each period |
| **Insurance** | Supports proof of required maintenance |
| **Technovigilance reporting** | Shows when an incident was recorded |

What it is **not**:

- It does **not** prove the maintenance was physically performed, or performed correctly. It proves the *record* was not altered after anchoring.
- It is **not a digital signature** under Argentine Law 25.506. It complements signatures; it does not replace them.
- Its weight as evidence is **up to the court**. It is technical, supporting evidence, not conclusive proof.
- It does **not** by itself make an institution compliant with ANMAT or ISO 13485. It **supports** demonstrating traceability requirements.

## Independent verification (for experts and auditors)

Verification does not depend on Meditrace being online, or being trusted. With the original record and any SHA-256 tool:

1. **Canonicalize the record**: the JSON with keys sorted alphabetically, no whitespace, UTF-8.
2. **Hash it**: `sha256` of that exact string.
3. **Find the anchor**: open the asset's mailbox address in any Solana explorer (or query `getSignaturesForAddress` on any RPC node) and read the memo of each transaction.
4. **Compare**: if a memo contains the same hash, the record is unaltered. The block time shows when it was anchored.
5. **Check the chain**: each memo's last field must equal the previous event's hash, in block order, starting from `GENESIS`.

Each step can be reproduced in front of a court with public tools.

## Why Solana

- **Cost**: one anchoring transaction costs about ◎0.000006, a fraction of a cent.
- **Speed**: confirmed in seconds and finalized shortly after.
- **No custom program needed for the MVP**: Memo program + System transfer, so the attack surface is minimal.
- **Public verifiability**: any explorer or RPC can confirm the proof, with no dependency on Meditrace.

## How it works on-chain

Each asset gets a deterministic **mailbox address** derived with `createAddressWithSeed(notary, assetId, SystemProgram)`. Nobody holds its private key; it only receives deposits. Every event is one transaction with:

1. a transfer to the asset's mailbox (rent-exempt minimum on the first event, 1 lamport afterwards), so the event is indexed under that address;
2. a memo:

```
MEDTRC|<assetId>|<eventType>|<result>|<sha256>|<prevHash>
MEDTRC|AST-2ADBF9C13D|CALIBRACION|PASS|51a3bc0b…|GENESIS        ← public
MEDTRC|AST-2ADBF9C13D|PRIVADO|PRIVADO|7c91e2fa…|51a3bc0b…      ← hash-only
```

Reading an asset's history means listing the signatures for its mailbox and parsing the memos. No indexer or database is needed.

Records are hashed after **deterministic canonicalization** (keys sorted recursively, no whitespace, UTF-8), so the same record always produces the same hash on any machine.

## API (for CMMS integration)

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| `POST` | `/api/equipment` | — | `{ assetId, assetAddress }` (new pseudonymous ID) |
| `POST` | `/api/anchor` | `{ assetId, eventType, result, recordHash, prevHash?, visibility? }` | `{ signature, memo, explorerUrl }` |
| `GET` | `/api/history/:assetId` | — | on-chain events of the asset |
| `POST` | `/api/verify` | `{ assetId, recordHash }` | `{ verified, matchedSignature, explorerUrl }` |

`visibility` is `"public"` (default) or `"hash-only"`. In `hash-only` mode, `eventType` and `result` are not required.

Both endpoints accept **only hashes**: there is no way to send a document to Meditrace.

Example:

```bash
curl -X POST http://localhost:3000/api/anchor \
  -H "Content-Type: application/json" \
  -d '{"assetId":"AST-2ADBF9C13D","eventType":"PREVENTIVO","result":"PASS",
       "recordHash":"<sha256-hex>","prevHash":"GENESIS"}'
```

## The demo app

| Page | Role |
|---|---|
| `/` | **Landing**: explains the problem and the solution, with an interactive playground — verify a real devnet record in the browser, tamper it, watch it flip to `NO COINCIDE` |
| `/equipos` | **Demo CMMS**: register equipment, get a pseudonymous ID, and link to its on-chain history (as a CMMS would, from its own equipment page) |
| `/service` | **Demo CMMS**: log a maintenance event. It is hashed in the browser, anchored, and you get the record JSON plus a **document QR** |
| `/verificar` | **Public portal**: verify a document (paste, upload, or scan its QR) and browse the asset's on-chain history and chain integrity |

The **document QR** carries the record itself, not just its hash. When an auditor scans it, the portal shows the record's contents so they can be compared with the printed report, then recomputes the hash and checks it against the chain. A QR holding only a hash could be copied onto a forged report; one holding the content cannot.

### Demo flow (about 2 minutes)

1. `/equipos`: register a device and get its pseudonymous ID.
2. `/service`: anchor an event, then a second one (watch it chain to the first).
3. `/verificar`: paste the record and get **VERIFICADO**.
4. Change one character and get **NO COINCIDE**.

## Run locally

Requirements: Node 20+, a devnet notary keypair with some devnet SOL.

```bash
npm install

# notary keypair (devnet only — never commit it; keys/ is gitignored)
mkdir keys
solana-keygen new --no-bip39-passphrase -o keys/notary.json
solana airdrop 1 $(solana-keygen pubkey keys/notary.json) --url devnet

npm run dev
# http://localhost:3000
```

The notary key is read from the `NOTARY_KEY` environment variable (the keypair's JSON array, see `.env.example`), falling back to `keys/notary.json`. Use the variable for deployments (e.g. Vercel → Settings → Environment Variables); `.env.local` and `keys/` are gitignored.

Stack: Next.js 16 · TypeScript · Tailwind CSS 4 · `@solana/kit` 8 (plugin client, transaction v1) · `@solana-program/memo` · `@solana-program/system`.

## Limitations (honest)

- **Garbage in, garbage out**: the chain proves a record was not altered after anchoring and existed at that time. It does not prove the maintenance physically happened. That still depends on the technician and the institution. What Meditrace does is make *retroactive* falsification detectable: backfilling or editing history after the fact.
- **Only anchored events are covered**: an event that was never anchored cannot be detected as missing. The chain detects removal or insertion among anchored events.
- **The record must be kept**: the hash cannot reconstruct the document. The CMMS (or immutable WORM storage) is responsible for retention and chain of custody.
- **Legal weight**: not a digital signature under Law 25.506. Admissibility and weight as evidence depend on the court, and may require an expert to explain the system.
- **Immutability cuts both ways**: an anchored entry cannot be deleted, which is why no personal data ever goes on-chain.
- **Single notary wallet in the MVP**: every event is signed by the Meditrace notary.
- **Devnet only**.

## Roadmap

- **Per-institution signing**: each CMMS or hospital gets its own signing key (managed in a KMS), so the chain proves *who* certified each record.
- **Digital signature integration**: sign records with certificates from an accredited authority (Law 25.506) before anchoring, to add authorship to integrity.
- **Expert report template**: a standard technical report that explains the verification process to a court.
- **Merkle batching**: anchor one root per time window, so cost stays flat no matter the volume.
- **PDF anchoring**: hash the actual signed report (PAdES), so auditors just upload the PDF they received.
- **Exposure policy per tenant**: today the mode is chosen per event; next is a default policy per institution (e.g. always `hash-only` for incidents).
- **Camera QR scanning** in the portal, plus a CMMS SDK for canonical hashing.
- **First integration: [MeDevice](#team)**, our own CMMS.

## Team

Built by a biomedical engineer with hands-on clinical engineering experience in public hospitals in Argentina, and the developer of **MeDevice**, a medical equipment management system. Meditrace comes from seeing, first-hand, how maintenance histories are handled when equipment changes hands.
