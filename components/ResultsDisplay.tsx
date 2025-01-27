import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { toast } from "@/hooks/use-toast"
import { Settings, Check } from "lucide-react"
import InvestmentChart from "./InvestmentChart"
import { calculateRetirementSustainability } from "../utils/calculations"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { CalculationResult } from "../types/calculatorTypes"

interface ResultsDisplayProps {
  results: CalculationResult | null
  initialBTC: number
  currentAge: number
  retirementIncome: number
  currentBTCPrice: number | null
}

type ViewType = "table" | "chart"

export default function ResultsDisplay({
  results,
  initialBTC,
  currentAge,
  retirementIncome,
  currentBTCPrice,
}: ResultsDisplayProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [showColumns, setShowColumns] = useState({
    totalValue: true,
    btcAmount: true,
    btcPurchased: true,
    etfValue: true,
    etfContribution: true,
    etfGrowth: true,
    btcPrice: true,
    btcContribution: true,
    btcGrowth: true,
  })

  const [view, setView] = useState<ViewType>("table")

  if (!results) return null

  const handleViewChange = (newView: ViewType) => {
    try {
      if (!Number.isFinite(results.totalBTC)) {
        throw new Error("Invalid Bitcoin value")
      }
      
      setView(newView)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to display Bitcoin values. Please check your input.",
        variant: "destructive"
      })
    }
  }

  const toggleColumn = (column: keyof typeof showColumns) => {
    setShowColumns((prev) => ({ ...prev, [column]: !prev[column] }))
    // Don't close the popover when toggling columns
  }

  const retirementAge = currentAge + results.yearlyBreakdown.length - 1
  const finalBTCPrice = results.yearlyBreakdown[results.yearlyBreakdown.length - 1].btcPrice

  const retirementAnalysis = calculateRetirementSustainability(
    results.totalValue,
    retirementIncome,
    2 // 2% inflation rate
  )

  return (
    <Card className="h-full flex flex-col min-w-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investment Results</CardTitle>
        <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={isSettingsOpen ? "bg-accent" : ""}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-4">
              <div className="font-medium">Visible Columns</div>
              <Separator />
              <div className="space-y-2">
                {Object.entries(showColumns).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-md p-2"
                    onClick={() => toggleColumn(key as keyof typeof showColumns)}
                  >
                    <div className={`h-4 w-4 border rounded-sm flex items-center justify-center ${value ? 'bg-primary border-primary' : 'border-input'}`}>
                      {value && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4 h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p>
                <strong className="text-purple-500 dark:text-purple-400">Your retirement age:</strong>{" "}
                <span className="text-purple-500 dark:text-purple-400">{retirementAge}</span>
              </p>
              <p>
                <strong className="text-orange-500 dark:text-orange-400">₿ Price when you retire:</strong>{" "}
                <span className="text-orange-500 dark:text-orange-400">
                  {finalBTCPrice.toLocaleString("en-US", { style: "currency", currency: "EUR" })}
                </span>
              </p>
              <p>
                <strong className="text-cyan-500 dark:text-cyan-400">Current ₿ Price:</strong>{" "}
                <span className="text-cyan-500 dark:text-cyan-400">
                  {currentBTCPrice?.toLocaleString("en-US", { style: "currency", currency: "EUR" })}
                </span>
              </p>
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
              <p className="font-semibold font-mono" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                {results.totalValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bitcoin</h3>
              <p className="font-semibold font-mono text-[#F7931A]" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                {Number(results.totalBTC).toFixed(6)} BTC
              </p>
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-sm font-medium text-muted-foreground">Total ETF</h3>
              <p className="font-semibold font-mono" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                {results.totalETF.toLocaleString("en-US", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </div>
          
          <Tabs value={view} onValueChange={(v) => handleViewChange(v as ViewType)} className="w-full flex-1">
            <TabsList className="w-full justify-start bg-background border-b mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left font-medium text-muted-foreground">Year</th>
                      {showColumns.totalValue && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          Total Value
                        </th>
                      )}
                      {showColumns.etfValue && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          ETF Value
                        </th>
                      )}
                      {showColumns.etfContribution && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          ETF Contribution
                        </th>
                      )}
                      {showColumns.etfGrowth && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          ETF Growth
                        </th>
                      )}
                      {showColumns.btcAmount && (
                        <th className="p-3 text-right font-medium text-[#F7931A] whitespace-nowrap">
                          ₿ Amount
                        </th>
                      )}
                      {showColumns.btcPurchased && (
                        <th className="p-3 text-right font-medium text-[#F7931A] whitespace-nowrap">
                          ₿ Purchased
                        </th>
                      )}
                      {showColumns.btcPrice && (
                        <th className="p-3 text-right font-medium text-[#F7931A] whitespace-nowrap">
                          ₿ Price
                        </th>
                      )}
                      {showColumns.btcContribution && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          BTC Contribution
                        </th>
                      )}
                      {showColumns.btcGrowth && (
                        <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                          BTC Growth
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {results.yearlyBreakdown.map((year, index) => (
                      <tr key={year.year} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3">{index === 0 ? "Current" : year.year}</td>
                        {showColumns.totalValue && (
                          <td className="p-3 text-right">
                            {year.totalValue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.etfValue && (
                          <td className="p-3 text-right">
                            {year.etfValue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.etfContribution && (
                          <td className="p-3 text-right">
                            {year.etfContribution.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.etfGrowth && (
                          <td className="p-3 text-right">
                            {year.etfGrowth.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.btcAmount && (
                          <td className="p-3 text-right text-[#F7931A] font-medium">{Number(year.totalBTC).toFixed(6)}</td>
                        )}
                        {showColumns.btcPurchased && (
                          <td className="p-3 text-right text-[#F7931A] font-medium">{Number(year.btcPurchased).toFixed(6)}</td>
                        )}
                        {showColumns.btcPrice && (
                          <td className="p-3 text-right text-[#F7931A] font-medium">
                            {year.btcPrice.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.btcContribution && (
                          <td className="p-3 text-right">
                            {year.btcContribution.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                        {showColumns.btcGrowth && (
                          <td className="p-3 text-right">
                            {year.btcGrowth.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="flex-1 min-h-[500px]">
              <div className="h-full w-full overflow-x-auto min-w-0">
                <InvestmentChart data={results} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Retirement Sustainability Analysis */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Retirement Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sustainable Annual Withdrawal (4% Rule)</p>
                <p className="text-lg font-mono">
                  {retirementAnalysis.sustainableAnnualWithdrawal.toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Desired Annual Income</p>
                <p className="text-lg font-mono">
                  {retirementIncome.toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Portfolio Sustainability</p>
                {retirementAnalysis.isSustainable ? (
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">
                    Your portfolio supports sustainable long-term withdrawals
                  </p>
                ) : retirementAnalysis.yearsUntilDepletion === Infinity ? (
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">
                    Your portfolio will sustain your desired income indefinitely
                  </p>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
                      Portfolio will last approximately {retirementAnalysis.yearsUntilDepletion} years
                      {retirementAnalysis.monthsRemaining > 0 && ` and ${retirementAnalysis.monthsRemaining} months`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider reducing withdrawals or increasing savings to ensure long-term sustainability
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}