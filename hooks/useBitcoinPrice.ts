import { useState, useEffect } from "react"

export function useBitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch("/api/btc-price")
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setPrice(data.price)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch BTC price")
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    // Fetch price every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { price, loading, error }
}

