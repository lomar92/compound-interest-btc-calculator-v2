import { Handler } from "@netlify/functions"

// Cache structure
interface Cache {
  price: number
  timestamp: number
}

let priceCache: Cache | null = null
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export const handler: Handler = async (event, context) => {
  try {
    const currentTime = Date.now()

    // Check if we have a valid cached price
    if (priceCache && (currentTime - priceCache.timestamp) < CACHE_DURATION) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`,
          'Expires': new Date(currentTime + CACHE_DURATION).toUTCString(),
          'Last-Modified': new Date(priceCache.timestamp).toUTCString()
        },
        body: JSON.stringify({ 
          price: priceCache.price,
          cached: true,
          cacheAge: (currentTime - priceCache.timestamp) / 1000
        })
      }
    }

    // Fetch new price if cache is invalid or missing
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur")
    const data = await response.json()
    const eurPrice = data.bitcoin.eur

    // Update cache
    priceCache = {
      price: eurPrice,
      timestamp: currentTime
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`,
        'Expires': new Date(currentTime + CACHE_DURATION).toUTCString(),
        'Last-Modified': new Date(currentTime).toUTCString()
      },
      body: JSON.stringify({ 
        price: eurPrice,
        cached: false
      })
    }
  } catch (error) {
    console.error("Error fetching BTC price:", error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "Failed to fetch BTC price" })
    }
  }
}
