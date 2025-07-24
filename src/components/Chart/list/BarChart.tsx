import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = Array.from({ length: 6 }, (_, i) => ({
  name: `P${i + 1}`,
  uv: Math.floor(Math.random() * 400 + 100),
  pv: Math.floor(Math.random() * 400 + 100),
}));

export const TinyBarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="uv" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export const StackedBarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="uv" stackId="a" fill="#8884d8" />
      <Bar dataKey="pv" stackId="a" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);
