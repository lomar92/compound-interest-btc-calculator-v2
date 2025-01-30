interface CalculationParams {
  initialCapital: number
  monthlyETF: number
  monthlyBTC: number
  etfReturn: number
  btcGrowth: number
  years: number
  currentBTCPrice: number
  btcHodl: number
  inflation: number
}

interface RetirementSustainability {
  sustainableAnnualWithdrawal: number
  yearsUntilDepletion: number
  monthsRemaining: number
  isSustainable: boolean
}

function calculateRetirementSustainability(
  portfolioValue: number,
  desiredAnnualIncome: number,
  inflationRate: number = 2
): RetirementSustainability {
  const sustainableAnnualWithdrawal = portfolioValue * 0.04
  let remainingPortfolio = portfolioValue
  let years = 0
  let months = 0
  
  // If sustainable withdrawal > desired income, it's sustainable indefinitely
  if (sustainableAnnualWithdrawal >= desiredAnnualIncome) {
    return {
      sustainableAnnualWithdrawal,
      yearsUntilDepletion: Infinity,
      monthsRemaining: 0,
      isSustainable: true
    }
  }

  // Calculate how long the portfolio will last
  while (remainingPortfolio > 0) {
    const monthlyWithdrawal = desiredAnnualIncome / 12
    const monthlyInflation = inflationRate / 12 / 100
    
    for (let month = 0; month < 12 && remainingPortfolio > 0; month++) {
      // Monthly return (4% annual return divided by 12)
      remainingPortfolio *= (1 + 0.04 / 12)
      // Monthly withdrawal adjusted for inflation
      const inflationAdjustedWithdrawal = monthlyWithdrawal * (1 + monthlyInflation) ** (years * 12 + month)
      remainingPortfolio -= inflationAdjustedWithdrawal
      
      if (remainingPortfolio <= 0) {
        months = month
        break
      }
    }
    
    if (remainingPortfolio > 0) {
      years++
    }
    
    // Cap at 100 years to prevent infinite loops
    if (years >= 100) {
      return {
        sustainableAnnualWithdrawal,
        yearsUntilDepletion: Infinity,
        monthsRemaining: 0,
        isSustainable: true
      }
    }
  }

  return {
    sustainableAnnualWithdrawal,
    yearsUntilDepletion: years,
    monthsRemaining: months,
    isSustainable: years >= 30
  }
}

export function calculateInvestments(params: CalculationParams) {
  const { initialCapital, monthlyETF, monthlyBTC, etfReturn, btcGrowth, years, currentBTCPrice, btcHodl, inflation } =
    params

  // Initialize values
  let totalValue = 0
  let totalBTC = Number(btcHodl)
  let totalETF = Number(initialCapital)
  const yearlyBreakdown = []

  const monthlyETFRate = (1 + etfReturn / 100) ** (1 / 12) - 1
  const monthlyBTCRate = (1 + btcGrowth / 100) ** (1 / 12) - 1
  const monthlyInflationRate = (1 + inflation / 100) ** (1 / 12) - 1
  const realMonthlyETFRate = ((1 + etfReturn / 100) / (1 + inflation / 100)) ** (1 / 12) - 1

  const currentYear = new Date().getFullYear()
  let btcPrice = currentBTCPrice

  for (let year = 0; year <= years; year++) {
    const yearStartBTC = totalBTC
    const yearStartETF = totalETF
    let yearlyBTCPurchased = 0
    let yearlyETFContributions = 0

    // Calculate BTC value at start of year for growth calculation
    const yearStartBTCValue = yearStartBTC * btcPrice

    for (let month = 1; month <= 12; month++) {
      // ETF investment
      yearlyETFContributions += monthlyETF
      totalETF = (totalETF + monthlyETF) * (1 + realMonthlyETFRate)

      // BTC purchase
      if (monthlyBTC > 0) {
        const btcBought = monthlyBTC / btcPrice
        totalBTC += btcBought
        yearlyBTCPurchased += btcBought
      }

      // Update BTC price monthly
      btcPrice *= 1 + monthlyBTCRate

      btcPrice /= 1 + monthlyInflationRate
    }

    const btcValue = totalBTC * btcPrice
    totalValue = Math.max(totalETF + btcValue, 0)

    yearlyBreakdown.push({
      year: currentYear + year,
      totalValue: totalValue,
      totalBTC: totalBTC,
      btcPrice: btcPrice,
      etfValue: totalETF,
      btcValue: btcValue,
      btcPurchased: yearlyBTCPurchased,
      etfContribution: yearlyETFContributions,
      btcContribution: monthlyBTC * 12,
      etfGrowth: totalETF - yearStartETF - yearlyETFContributions,
      btcGrowth: btcValue - yearStartBTC * btcPrice - monthlyBTC * 12,
    })
  }

  return {
    totalValue,
    totalBTC,
    totalETF,
    yearlyBreakdown,
    finalBTCPrice: btcPrice,
  }
}

export { calculateRetirementSustainability }
