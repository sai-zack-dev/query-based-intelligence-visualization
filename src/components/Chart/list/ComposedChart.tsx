import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const data = Array.from({ length: 6 }, (_, i) => ({
  name: `P${i + 1}`,
  uv: Math.floor(Math.random() * 400 + 100),
  pv: Math.floor(Math.random() * 400 + 100),
  amt: Math.floor(Math.random() * 400 + 100),
}));

export const LineBarAreaComposedChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#f5f5f5" />
      <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
      <Bar dataKey="pv" barSize={20} fill="#413ea0" />
      <Line type="monotone" dataKey="uv" stroke="#ff7300" />
    </ComposedChart>
  </ResponsiveContainer>
);
