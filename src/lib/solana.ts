import {
  address,
  createAddressWithSeed,
  createClient,
  lamports,
  type Address,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signerFromFile } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";
import { getAddMemoInstruction } from "@solana-program/memo";
import path from "path";

const NOTARY_KEYPAIR_PATH = path.join(process.cwd(), "keys", "notary.json");
export const SYSTEM_PROGRAM = address(
  "11111111111111111111111111111111"
);

export const MEMO_PREFIX = "MEDTRC";

export async function getNotaryClient() {
  const client = await createClient()
    .use(await signerFromFile(NOTARY_KEYPAIR_PATH))
    .use(
      solanaDevnetRpc({
        transactionConfig: { version: 1, priorityFeeLamports: lamports(1_000n) },
      })
    );
  return client;
}

/**
 * Dirección determinística del "buzón" del equipo.
 * Derivada de (notary pubkey + assetId) con el System Program.
 * Nadie tiene su clave privada: solo recibe depósitos que la indexan.
 */
export async function getAssetAddress(
  notaryAddress: Address,
  assetId: string
): Promise<Address> {
  if (assetId.length > 32) {
    throw new Error("assetId excede 32 caracteres (límite del seed)");
  }
  return createAddressWithSeed({
    baseAddress: notaryAddress,
    seed: assetId,
    programAddress: SYSTEM_PROGRAM,
  });
}

export interface AnchorEventInput {
  assetId: string;
  eventType: string;
  result: string;
  recordHash: string; // sha256 hex del registro completo (off-chain)
  prevHash?: string; // hash del evento anterior del activo ("GENESIS" si es el primero)
}

/** Arma el memo compacto que viaja on-chain. Nada de datos sensibles. */
export function buildMemo(e: AnchorEventInput): string {
  return `${MEMO_PREFIX}|${e.assetId}|${e.eventType}|${e.result}|${e.recordHash}|${e.prevHash ?? "GENESIS"}`;
}

/**
 * Ancla un evento en devnet:
 * [transfer EVENT_LAMPORTS -> assetAddr] + [memo MEDTRC|...|hash]
 */
export async function anchorEvent(e: AnchorEventInput) {
  const client = await getNotaryClient();
  const assetAddr = await getAssetAddress(client.payer.address, e.assetId);

  // El primer depósito crea la cuenta del buzón: fondea el mínimo exento de
  // renta. En eventos siguientes basta 1 lamport para dejar la firma indexada.
  const existing = await client.rpc.getAccountInfo(assetAddr).send();
  const amount = existing.value
    ? lamports(1n)
    : lamports(await client.getMinimumBalance(0));
  const transferIx = getTransferSolInstruction({
    source: client.payer,
    destination: assetAddr,
    amount,
  });
  const memoIx = getAddMemoInstruction({ memo: buildMemo(e) });

  const result = await client.sendTransaction([transferIx, memoIx]);
  // El resultado de un single-plan trae la firma en context.signature
  const signature = String(
    (result as { context?: { signature?: unknown } }).context?.signature ?? result
  );
  return { signature, assetAddress: assetAddr };
}

export interface ChainEvent {
  signature: string;
  blockTime: number | null;
  memo: string | null;
  parsed: {
    assetId: string;
    eventType: string;
    result: string;
    recordHash: string;
    prevHash: string | null; // eslabón con el evento anterior (v2). null en memos v1
  } | null;
}

/** Lee el historial on-chain del equipo (todas las txs del buzón). */
export async function getAssetHistory(
  notaryAddress: Address,
  assetId: string
): Promise<{ assetAddress: Address; events: ChainEvent[] }> {
  const client = await getNotaryClient();
  const assetAddr = await getAssetAddress(notaryAddress, assetId);

  const sigs = await client.rpc
    .getSignaturesForAddress(assetAddr, { limit: 100 })
    .send();

  const events: ChainEvent[] = [];
  for (const s of sigs) {
    const tx = await client.rpc
      .getTransaction(s.signature, {
        maxSupportedTransactionVersion: 1,
        encoding: "jsonParsed",
      })
      .send();
    let memo: string | null = null;
    const ixs = tx?.transaction.message.instructions ?? [];
    for (const ix of ixs as any[]) {
      if (ix.program === "spl-memo" && typeof ix.parsed === "string") {
        memo = ix.parsed;
      }
    }
    events.push({
      signature: String(s.signature),
      blockTime: s.blockTime != null ? Number(s.blockTime) : null,
      memo,
      parsed: parseMemo(memo),
    });
  }
  return { assetAddress: assetAddr, events };
}

export function parseMemo(memo: string | null): ChainEvent["parsed"] {
  if (!memo) return null;
  const parts = memo.split("|");
  // v1: 5 campos sin eslabón · v2: 6 campos con prevHash
  if (parts.length !== 5 && parts.length !== 6) return null;
  if (parts[0] !== MEMO_PREFIX) return null;
  return {
    assetId: parts[1],
    eventType: parts[2],
    result: parts[3],
    recordHash: parts[4],
    prevHash: parts.length === 6 ? parts[5] : null,
  };
}
