"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moodData = [
  { day: "Mon", mood: 6 },
  { day: "Tue", mood: 5 },
  { day: "Wed", mood: 7 },
  { day: "Thu", mood: 6 },
  { day: "Fri", mood: 8 },
  { day: "Sat", mood: 8 },
  { day: "Sun", mood: 7 },
];

export function MoodChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={moodData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="day"
          stroke="var(--color-foreground)"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="var(--color-foreground)"
          style={{ fontSize: "12px" }}
          domain={[0, 10]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: `1px solid var(--color-border)`,
            borderRadius: "8px",
          }}
          labelStyle={{ color: "var(--color-foreground)" }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: "var(--color-primary)", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
