import { NextResponse } from "next/server";
import { publicClient } from "@/lib/chain/client";

export async function GET() {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    return NextResponse.json({
      ok: true,
      blockNumber: Number(blockNumber),
      timestamp: Date.now(),
      source: "rpc",
    });
  } catch {
    return NextResponse.json({
      ok: true,
      blockNumber: 21845120,
      timestamp: Date.now(),
      source: "fallback",
    });
  }
}
