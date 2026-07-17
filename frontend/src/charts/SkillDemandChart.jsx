import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = [
  "#9b6cff",
  "#6fa4ff",
  "#55e6ba",
  "#ef8bc2",
  "#ffb84d",
  "#61dafb",
];

export default function SkillDemandChart() {
  const { topSkills } = useSelector((state) => state.dashboard);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={topSkills}
        layout="vertical"
        margin={{
          top: 10,
          right: 20,
          left: 60,
          bottom: 10,
        }}
      >
        <XAxis type="number" hide />

        <YAxis
          type="category"
          dataKey="name"
          width={180}
          tick={{
            fill: "#c9c6d8",
            fontSize: 12,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          formatter={(value) => [`${value} Jobs`, "Demand"]}
          cursor={{
            fill: "rgba(255,255,255,.04)",
          }}
          contentStyle={{
            background: "#1b1838",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
          }}
        />

        <Bar
          dataKey="value"
          radius={[0, 8, 8, 0]}
          barSize={16}
        >
          {topSkills.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}