import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const sampleData = [
  { day: "Sept 10", value: 40 },
  { day: "Sept 11", value: 60 },
  { day: "Sept 12", value: 80 },
  { day: "Sept 13", value: 20 },
  { day: "Sept 14", value: 10 },
  { day: "Sept 15", value: 25 },
  { day: "Sept 16", value: 45 }
];

export default function SummaryChart() {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={sampleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" radius={[6,6,0,0]} fill="#4f46e5" barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
