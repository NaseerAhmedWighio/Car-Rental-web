"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { client } from "@/sanity/lib/client"

interface CarCategory {
  category: string
  count: number
}

const categoryColors: Record<string, string> = {
  "Sport": "#0D3559",
  "SUV": "#175D9C",
  "Sedan": "#2185DE",
  "Coupe": "#63A9E8",
  "Hatchback": "#A6CEF2",
  "MPV": "#3B82F6",
  "Truck": "#1E40AF",
  "Van": "#2563EB",
}

const defaultCategoryColors: Record<string, string> = {
  "default1": "#0D3559",
  "default2": "#175D9C",
  "default3": "#2185DE",
  "default4": "#63A9E8",
  "default5": "#A6CEF2",
  "default6": "#3B82F6",
}

export default function Chart() {
  const [chartData, setChartData] = React.useState<Array<{ Cars: string; rents: number; fill: string }>>([])
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({
    rents: { label: "Cars" },
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchCarData = async () => {
      try {
        const query = `*[_type in ["popular", "recommended"]] {
          category
        }`
        const cars = await client.fetch(query)

        // Count cars by category
        const categoryCount: Record<string, number> = {}
        cars.forEach((car: { category: string }) => {
          const cat = car.category || "Other"
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })

        // Convert to chart data format
        const colorIndex: Record<string, number> = {}
        let defaultCounter = 1
        const data = Object.entries(categoryCount).map(([category, count]) => {
          const color = categoryColors[category] || (() => {
            const key = `default${defaultCounter++}`
            return defaultCategoryColors[key] || "#90A3BF"
          })()
          return {
            Cars: category,
            rents: count,
            fill: color,
          }
        })

        setChartData(data)

        // Build chart config
        const config: ChartConfig = { rents: { label: "Cars" } }
        Object.entries(categoryCount).forEach(([category]) => {
          config[category] = {
            label: category,
            color: categoryColors[category] || "#90A3BF",
          }
        })
        setChartConfig(config)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Fallback to empty
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchCarData()
  }, [])

  const totalCars = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.rents, 0)
  }, [chartData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-gray-400 text-sm">Loading chart...</p>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-gray-400 text-sm">No car data available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-transparent">
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="rents"
              nameKey="Cars"
              innerRadius={50}
              strokeWidth={12}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCars.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Cars
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
