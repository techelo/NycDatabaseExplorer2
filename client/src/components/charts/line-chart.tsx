import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartSeries {
  name: string;
  color?: string;
  dataKey: string;
}

interface LineChartProps {
  data: Array<Record<string, any>>;
  series: LineChartSeries[];
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  dateFormatter?: (date: string) => string;
}

export default function LineChart({
  data,
  series,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  title,
  height = 300,
  valueFormatter = (value) => `${value}`,
  dateFormatter,
}: LineChartProps) {
  // Default colors if not provided in series
  const defaultColors = ["#4361EE", "#F72585", "#3A0CA3", "#4CC9F0"];

  // Format for tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const displayLabel = dateFormatter ? dateFormatter(label) : label;
      
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded text-sm">
          <p className="font-medium">{displayLabel}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-2">
              <span>{entry.name}:</span>
              <span className="font-medium">{valueFormatter(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey={xAxisKey} 
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -5,
                  }
                : undefined
            }
            tickFormatter={dateFormatter}
          />
          <YAxis 
            tickFormatter={valueFormatter}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }
                : undefined
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
          />
          {series.map((s, index) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color || defaultColors[index % defaultColors.length]}
              activeDot={{ r: 5 }}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
