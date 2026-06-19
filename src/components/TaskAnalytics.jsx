"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981"];

export default function TaskAnalytics({
  chartData,
}) {
  return (
    <div className="flex justify-center overflow-x-auto">
      <PieChart
        width={350}
        height={300}
      >
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {chartData.map(
            (entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}