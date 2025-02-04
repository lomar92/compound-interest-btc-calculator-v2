import { Handler } from "@netlify/functions"

export const handler: Handler = async (event, context) => {
  try {
    const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    const data = await response.json()

    // Extract EUR price from the response
    const eurPrice = data.bpi.EUR.rate_float

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Allow requests from any origin
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ price: eurPrice })
    }
  } catch (error) {
    console.error("Error fetching BTC price:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch BTC price" })
    }
  }
}
