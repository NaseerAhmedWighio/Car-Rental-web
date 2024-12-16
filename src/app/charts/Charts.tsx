
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register core Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Center Text Plugin
const centerTextPlugin: Plugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, data, options, width, height } = chart;

    if (!ctx || !data || !options) return;

    // Calculate Total
    const total = (data.datasets[0].data as number[]).reduce(
      (a, b) => a + b,
      0
    );

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();

    // Draw Total Value
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = options.plugins?.centerText?.totalValueColor || "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), centerX, centerY - 10);

    // Draw Subtext
    ctx.font = "14px Arial";
    ctx.fillStyle = options.plugins?.centerText?.subTextColor || "#666";
    ctx.fillText("Rental Car", centerX, centerY + 20);

    ctx.restore();
  },
};

// Register the plugin
ChartJS.register(centerTextPlugin);

// Chart Component
export default function Charts() {
  const data = {
    datasets: [
      {
        label: "Sell",
        data: [17439, 9478, 18197, 12510, 14406],
        backgroundColor: [
          "#0D3559",
          "#175D9C",
          "#2185DE",
          "#63A9E8",
          "#A6CEF2",
        ],
        borderRadius: 5,
        cutout: 98,
      },
    ],
  };

  const options = {
    plugins: {
      centerText: {
        totalValueColor: "#000", // Customize total value color
        subTextColor: "#666", // Customize subtext color
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-80 h-80">
      <Doughnut data={data} options={options} />
    </div>
  );
}