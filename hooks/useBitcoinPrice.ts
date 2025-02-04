import { useState, useEffect } from "react"

export function useBitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch price only once when component mounts
  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch("/netlify/functions/btc-price")
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
  }, [])

  return { price, loading, error }
}
