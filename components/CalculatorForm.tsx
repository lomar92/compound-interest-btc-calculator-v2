"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { calculateInvestments } from "../utils/calculations"
import type { CalculationResult } from "../types/calculatorTypes"

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult, btcHodl: number, currentAge: number, retirementIncome: number) => void
  currentBTCPrice: number | null
}

export default function CalculatorForm({ onCalculate, currentBTCPrice }: CalculatorFormProps) {
  const [formData, setFormData] = useState({
    initialCapital: 10000,
    monthlyETF: 1000,
    monthlyBTC: 300,
    etfReturn: 7,
    btcGrowth: 20,
    years: 10,
    btcHodl: 0.2,
    currentAge: 30,
    retirementIncome: 50000,
    inflation: 2,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }))
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!currentBTCPrice) return

      const result = calculateInvestments({
        ...formData,
        currentBTCPrice,
      })
      onCalculate(result, formData.btcHodl, formData.currentAge, formData.retirementIncome)
    },
    [currentBTCPrice, formData, onCalculate],
  )

  useEffect(() => {
    if (currentBTCPrice) {
      const result = calculateInvestments({
        ...formData,
        currentBTCPrice,
      })
      onCalculate(result, formData.btcHodl, formData.currentAge, formData.retirementIncome)
    }
  }, [currentBTCPrice, formData, onCalculate])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value !== "") {
      setFormData((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialCapital">Initial Capital (EUR)</Label>
            <Input
              type="number"
              id="initialCapital"
              name="initialCapital"
              value={formData.initialCapital}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="btcHodl">Hodl BTC</Label>
            <Input
              type="number"
              id="btcHodl"
              name="btcHodl"
              value={formData.btcHodl}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              step="0.000001"
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyETF">Monthly ETF Savings (EUR)</Label>
            <Input
              type="number"
              id="monthlyETF"
              name="monthlyETF"
              value={formData.monthlyETF}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyBTC">Monthly BTC Savings (EUR)</Label>
            <Input
              type="number"
              id="monthlyBTC"
              name="monthlyBTC"
              value={formData.monthlyBTC}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etfReturn">ETF Return (%)</Label>
            <Input
              type="number"
              id="etfReturn"
              name="etfReturn"
              value={formData.etfReturn}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="btcGrowth">BTC Annual Growth (%)</Label>
            <Input
              type="number"
              id="btcGrowth"
              name="btcGrowth"
              value={formData.btcGrowth}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inflation">Annual Inflation (%)</Label>
            <Input
              type="number"
              id="inflation"
              name="inflation"
              value={formData.inflation}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Investment Period (Years)</Label>
            <Input
              type="number"
              id="years"
              name="years"
              value={formData.years}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAge">Current Age</Label>
            <Input
              type="number"
              id="currentAge"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retirementIncome">Desired Annual Retirement Income (EUR)</Label>
            <Input
              type="number"
              id="retirementIncome"
              name="retirementIncome"
              value={formData.retirementIncome}
              onChange={handleChange}
              onFocus={handleFocus}
              className="font-mono"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#F7931A] hover:bg-[#E87F15] mt-6" disabled={!currentBTCPrice}>
            Calculate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}