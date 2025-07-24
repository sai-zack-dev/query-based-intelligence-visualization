import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = Array.from({ length: 6 }, (_, i) => ({
  name: `P${i + 1}`,
  uv: Math.floor(Math.random() * 400 + 100),
  pv: Math.floor(Math.random() * 400 + 100),
  amt: Math.floor(Math.random() * 400 + 100),
}));

export const SimpleLineChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export const DashedLineChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export const BiaxialLineChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Line yAxisId="left" type="monotone" dataKey="uv" stroke="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="pv" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

// export const LineChartConnectNulls = () => {
//   const dataWithNulls = [...data];
//   dataWithNulls[2].uv = null;
//   dataWithNulls[4].pv = null;

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <LineChart data={dataWithNulls}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line connectNulls type="monotone" dataKey="uv" stroke="#8884d8" />
//         <Line connectNulls type="monotone" dataKey="pv" stroke="#82ca9d" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };
