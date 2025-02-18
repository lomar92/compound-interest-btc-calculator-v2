import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur");
    const data = await response.json();

    // Extract EUR price from the response
    const eurPrice = data.bitcoin.eur;

    return NextResponse.json({ price: eurPrice });
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    return NextResponse.json({ error: "Failed to fetch BTC price" }, { status: 500 });
  }
}
