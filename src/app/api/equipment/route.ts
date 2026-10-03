import { getAssetAddress, getNotaryClient } from "@/lib/solana";
import { generateAssetId } from "@/lib/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/equipment — genera un assetId seudónimo y su buzón on-chain.
 * Stateless: Meditrace NO guarda la correspondencia assetId ↔ equipo real;
 * esa tabla vive en el CMMS (en esta demo, en el navegador del usuario).
 */
export async function POST() {
  const assetId = await generateAssetId();
  const client = await getNotaryClient();
  const assetAddress = await getAssetAddress(client.payer.address, assetId);
  return Response.json({
    assetId,
    assetAddress: String(assetAddress),
    createdAt: new Date().toISOString(),
  });
}
