"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { CalculationResult } from "../types/calculatorTypes"

interface InvestmentChartProps {
  data: CalculationResult | null
}

export default function InvestmentChart({ data }: InvestmentChartProps) {
  if (!data) return null

  return (
    <Card className="w-full min-w-[800px] h-full">
      <CardHeader>
        <CardTitle>Portfolio Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ChartContainer
          config={{
            total: {
              label: "Total Value",
              color: "#6366f1",
              theme: {
                light: "#6366f1",
                dark: "#818cf8"
              }
            },
            btc: {
              label: "Bitcoin Value",
              color: "#F7931A",
              theme: {
                light: "#F7931A",
                dark: "#F7931A"
              }
            },
            etf: {
              label: "ETF Value",
              color: "#10b981",
              theme: {
                light: "#10b981",
                dark: "#34d399"
              }
            },
            btcContribution: {
              label: "BTC Contribution",
              color: "#f59e0b",
              theme: {
                light: "#f59e0b",
                dark: "#fbbf24"
              }
            },
            etfContribution: {
              label: "ETF Contribution",
              color: "#8b5cf6",
              theme: {
                light: "#8b5cf6",
                dark: "#a78bfa"
              }
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.yearlyBreakdown}>
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
                tickFormatter={(value, index) => (index === 0 ? "Current" : value)}
              />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EUR",
                    notation: "compact",
                  }).format(value)
                }
                tick={{ fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalValue"
                name="Total"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="btcValue"
                name="BTC"
                stroke="var(--color-btc)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="etfValue"
                name="ETF"
                stroke="var(--color-etf)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="btcContribution"
                name="BTC Contribution"
                stroke="var(--color-btcContribution)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="etfContribution"
                name="ETF Contribution"
                stroke="var(--color-etfContribution)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
