export interface CalculationResult {
  totalValue: number
  totalBTC: number
  totalETF: number
  yearlyBreakdown: Array<{
    year: number
    totalValue: number
    totalBTC: number
    btcPrice: number
    etfValue: number
    btcValue: number
    btcPurchased: number
    etfContribution: number
    btcContribution: number
    etfGrowth: number
    btcGrowth: number
  }>
}

export interface CalculatorFormData {
  initialCapital: number
  monthlyETF: number
  monthlyBTC: number
  etfReturn: number
  btcGrowth: number
  years: number
}

