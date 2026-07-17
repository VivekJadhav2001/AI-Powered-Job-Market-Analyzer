import Card from "../ui/Card";
import { FiArrowUpRight } from "react-icons/fi";
export default function MetricCard({ metric }) {
  return (
    <Card hover className="p-5">
      <p className="text-sm text-muted">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight text-white">
          {metric.value}
        </span>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${metric.accent}`}
        >
          <FiArrowUpRight />
          {metric.change}
        </span>
      </div>
    </Card>
  );
}
