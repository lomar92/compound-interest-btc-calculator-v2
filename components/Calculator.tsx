"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import CalculatorForm from "./CalculatorForm"
import ResultsDisplay from "./ResultsDisplay"
import { useBitcoinPrice } from "../hooks/useBitcoinPrice"
import type { CalculationResult } from "../types/calculatorTypes"

export default function Calculator() {
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [initialBTC, setInitialBTC] = useState(0)
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementIncome, setRetirementIncome] = useState(50000)
  const { price: btcPrice, loading, error } = useBitcoinPrice()

  const handleCalculate = useCallback((result: CalculationResult, btcHodl: number, age: number, income: number) => {
    setResults(result)
    setInitialBTC(btcHodl)
    setCurrentAge(age)
    setRetirementIncome(income)
  }, [])

  return (
    <div className="font-mono max-w-full w-auto mb-5">
      {/* Two-column layout for calculator and results */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px,1fr] gap-6 mb-6">
        <div>
          <CalculatorForm onCalculate={handleCalculate} currentBTCPrice={btcPrice} />
        </div>
        <div className="flex flex-col min-w-0">
          <ResultsDisplay
            results={results}
            initialBTC={initialBTC}
            currentAge={currentAge}
            retirementIncome={retirementIncome}
            currentBTCPrice={btcPrice}
          />
        </div>
      </div>

    </div>
  )
}

