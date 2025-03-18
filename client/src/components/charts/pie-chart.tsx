import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  dataKey?: string;
}

export default function PieChart({
  data,
  title,
  height = 300,
  colors = ["#4361EE", "#3A0CA3", "#F72585", "#4CC9F0", "#7209B7"],
  valueFormatter = (value) => `${value}`,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  dataKey = "value",
}: PieChartProps) {
  // Calculate percentages for each slice
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercentage = data.map(entry => ({
    ...entry,
    percentage: total > 0 ? (entry.value / total) * 100 : 0
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded text-sm">
          <p className="font-medium">{entry.name}</p>
          <p className="text-neutral-700">
            {valueFormatter(entry.value)} ({entry.percentage.toFixed(1)}%)
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
        <RechartsPieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any, index) => {
                const { percentage } = entry.payload;
                return (
                  <span className="text-sm">
                    {value} ({percentage.toFixed(1)}%)
                  </span>
                );
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
