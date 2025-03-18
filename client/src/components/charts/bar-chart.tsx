import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
    [key: string]: any;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  title?: string;
  valueFormatter?: (value: number) => string;
  height?: number;
  horizontal?: boolean;
}

export default function BarChart({
  data,
  xAxisLabel,
  yAxisLabel,
  colors = ["#4361EE", "#3A0CA3", "#F72585"],
  title,
  valueFormatter = (value) => `${value}`,
  height = 300,
  horizontal = false,
}: BarChartProps) {
  const defaultColor = colors[0];
  
  // Format for tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-neutral-700">
            {payload[0].name}: {valueFormatter(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={horizontal ? "value" : "name"}
            type={horizontal ? "number" : "category"}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -5,
                  }
                : undefined
            }
          />
          <YAxis
            dataKey={horizontal ? "name" : "value"}
            type={horizontal ? "category" : "number"}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }
                : undefined
            }
            tickFormatter={!horizontal ? valueFormatter : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          {data.length > 1 && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
            />
          )}
          <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length] || defaultColor}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
