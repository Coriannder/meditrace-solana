import { NextRequest } from "next/server";
import { getAssetHistory, getNotaryClient } from "@/lib/solana";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/verify — compara una huella contra los memos on-chain del equipo.
 *
 * Body: { assetId, recordHash } — el verificador hashea el documento de su lado.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const assetId = String(body?.assetId ?? "").trim();
  const computedHash = String(body?.recordHash ?? "").toLowerCase();

  if (!assetId) {
    return Response.json({ error: "Falta assetId" }, { status: 400 });
  }
  if (!/^[0-9a-f]{64}$/.test(computedHash)) {
    return Response.json(
      { error: "recordHash debe ser un sha256 hex (64 caracteres)" },
      { status: 400 }
    );
  }

  const client = await getNotaryClient();
  const { events } = await getAssetHistory(client.payer.address, assetId);
  const match = events.find(
    (e) => e.parsed && e.parsed.recordHash === computedHash
  );

  return Response.json({
    verified: Boolean(match),
    computedHash,
    matchedSignature: match?.signature ?? null,
    explorerUrl: match
      ? `https://explorer.solana.com/tx/${match.signature}?cluster=devnet`
      : null,
  });
}
