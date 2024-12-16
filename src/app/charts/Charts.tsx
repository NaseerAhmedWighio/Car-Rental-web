import React from "react"

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2"



ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
)

export default function Charts() {

    const data = {
        datasets: [{
            label: 'Sell',
            data: [17439, 9478, 18197, 12510, 14406],
            backgroundColor: ['#0D3559', "#175D9C", "#2185DE", "#63A9E8", "#A6CEF2"],
            borderRadius: 8,
            cutout: 98 ,
        }]
    }

    const options = {

    }

    const centerTextPlugin = {
        id: "centerText",
        beforeDraw(chart: { ctx?: any; data?: any; options?: any; width?: any; height?: any; }) {
          const { width, height } = chart;
          const ctx = chart.ctx;
          const total = chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
    
          const centerX = width / 2;
          const centerY = height / 2;
    
          ctx.save();
    
          // Draw Total Value
          ctx.font = `bold 26px Arial`;
          ctx.fillStyle = chart.options.plugins.centerText.totalValueColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(total, centerX, centerY - 10);
    
          // Draw Subtext
          ctx.font = `14px Arial`;
          ctx.fillStyle = chart.options.plugins.centerText.subTextColor;
          ctx.fillText("Rental Car",
            centerX,
            centerY + 20
          );
    
          ctx.restore();
        },
      };
    
      // Register the plugin
      ChartJS.register(centerTextPlugin);


    return (
        <>
            <div className="w-80 h-80">
                <Doughnut
                    data={data}
                    options={options}>
                </Doughnut>
            </div>
        </>
    )
}