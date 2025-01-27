import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    const data = await response.json()

    // Extract EUR price from the response
    const eurPrice = data.bpi.EUR.rate_float

    return NextResponse.json({ price: eurPrice })
  } catch (error) {
    console.error("Error fetching BTC price:", error)
    return NextResponse.json({ error: "Failed to fetch BTC price" }, { status: 500 })
  }
}

