import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";

export default function MarketTrendChart() {
  const { marketMomentum } = useSelector((state) => state.dashboard);

  console.log(marketMomentum,"marketMomentum")

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={marketMomentum}
        margin={{ left: -22, right: 6, top: 8 }}
      >
        <defs>
          <linearGradient id="rolesFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9b6cff" stopOpacity=".42" />
            <stop offset="100%" stopColor="#9b6cff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="period"
          tick={{ fill: "#817e9b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#817e9b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          formatter={(value) => [`${value} Jobs`, "Openings"]}
          contentStyle={{
            background: "#1b1838",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
          }}
          labelStyle={{ color: "#fff" }}
        />

        <Area
          type="linear"
          dataKey="jobs"
          stroke="#b18cff"
          strokeWidth={3}
          fill="url(#rolesFill)"
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}