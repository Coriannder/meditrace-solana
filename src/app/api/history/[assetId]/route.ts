import { getAssetHistory, getNotaryClient } from "@/lib/solana";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;
  const client = await getNotaryClient();
  const { assetAddress, events } = await getAssetHistory(
    client.payer.address,
    assetId
  );
  return Response.json({
    assetId,
    assetAddress: String(assetAddress),
    events,
    explorerUrl: `https://explorer.solana.com/address/${assetAddress}?cluster=devnet`,
  });
}
