import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { skillDemand } from "../data/dashboardData";

export default function SkillDemandChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={skillDemand}
        layout="vertical"
        margin={{ left: 14, right: 16 }}
      >
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: "#c9c6d8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={54}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,.04)" }}
          contentStyle={{
            background: "#1b1838",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
          }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={15}>
          {skillDemand.map((_, index) => (
            <Cell
              key={index}
              fill={["#9b6cff", "#6fa4ff", "#55e6ba", "#ef8bc2"][index]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
