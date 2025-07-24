import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = Array.from({ length: 6 }, (_, i) => ({
  name: `P${i + 1}`,
  uv: Math.floor(Math.random() * 400 + 100),
  pv: Math.floor(Math.random() * 400 + 100),
}));

export const SimpleAreaChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  </ResponsiveContainer>
);

// export const AreaChartConnectNulls = () => {
//   const dataWithNulls = [...data];
//   dataWithNulls[1].uv = null;
//   dataWithNulls[4].uv = null;

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <AreaChart data={dataWithNulls}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Area connectNulls type="monotone" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

export const PercentAreaChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} stackOffset="expand">
      <XAxis dataKey="name" />
      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
      <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
    </AreaChart>
  </ResponsiveContainer>
);
