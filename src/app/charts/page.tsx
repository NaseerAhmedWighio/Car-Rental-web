// "use client"

// import * as React from "react"
// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//   { Cars: "Sport Car", rents: 17439, fill: "#0D3559" },
//   { Cars: "SUV", rents: 9478, fill: "#175D9C" },
//   { Cars: "Coupe", rents: 18197, fill: "#2185DE" },
//   { Cars: "Hatchback", rents: 12510, fill: "#63A9E8" },
//   { Cars: "MPV", rents: 14406, fill: "#A6CEF2" },
// ]

// const chartConfig = {
//   rents: {
//     label: "Cars",
//   },
//   Sportcar: {
//     label: "Sport Car",
//     color: "#0D3559",
//   },
//   SUV: {
//     label: "SUV",
//     color: "#175D9C",
//   },
//   Coupe: {
//     label: "Coupe",
//     color: "#2185DE",
//   },
//   Hatchback: {
//     label: "Hatchback",
//     color: "#63A9E8",
//   },
//   MPV: {
//     label: "MPV",
//     color: "#A6CEF2",
//   },
// } satisfies ChartConfig

// export default function Chart() {
//   const totalVisitors = React.useMemo(() => {
//     return chartData.reduce((acc, curr) => acc + curr.rents, 0)
//   }, [])

//   return (
//     <Card className="flex flex-col">
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="rents"
//               nameKey="Cars"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalVisitors.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Rental Cars
//                         </tspan>
//                       </text>
//                     )
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }
