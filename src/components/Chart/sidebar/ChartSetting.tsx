import { useChart } from "@/context/ChartContext";
import { ColorPicker } from "@/components/ui/color-picker";
import { useEffect, useMemo, useState } from "react";
import SaveToDashboardModal from "./SaveToDashboardModal";

export default function ChartSetting() {
  const {
    resultData,
    xKey,
    setXKey,
    yKey,
    setYKey,
    lines,
    setLines,
    seriesKey,
    setSeriesKey,
    chartType,
    chartData,
  } = useChart();
  const [open, setOpen] = useState(false);
  const [chartTitle, setChartTitle] = useState("Untitled Chart");
  const columns = Object.keys(resultData?.[0] || {});
  const numericColumns = columns.filter((key) =>
    resultData.some(
      (row) => typeof row[key] === "number" || !isNaN(parseFloat(row[key]))
    )
  );

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));

    const toHex = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  const defaultColor = (i: number) => {
    const hue = (i * 137.508) % 360; // Golden angle
    return hslToHex(hue, 65, 55); // Convert to hex
  };

  // Get unique values of the selected series column
  const uniqueSeries: string[] = Array.from(
    new Set(resultData.map((item) => item?.[seriesKey]).filter(Boolean))
  );

  // Update `lines` state based on resultData and seriesKey
  useEffect(() => {
    if (!resultData || resultData.length === 0 || !seriesKey) return;

    const updated = uniqueSeries.map((val, idx) => {
      const existing = lines.find((l) => l.dataKey === val);
      return {
        dataKey: val,
        color: existing?.color || defaultColor(idx),
        active: existing?.active ?? true, // ✅ visibility
      };
    });

    setLines(updated);
  }, [resultData, seriesKey]);

  // Handle color change
  const handleChangeColor = (index: number, newColor: string) => {
    const updated = [...lines];
    updated[index].color = newColor;
    setLines(updated);
  };

  // Handle checkbox toggle
  const toggleLineVisibility = (index: number) => {
    const updated = [...lines];
    updated[index].active = !updated[index].active;
    setLines(updated);
  };
  const activeLines = useMemo(
    () => lines.filter((line) => line.active),
    [lines]
  );
  return (
    <>
      <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800 mb-3">
        Chart Preview
      </h2>
      <div className="pl-10 gap-4 flex flex-col">
        <div>
          <label className="input-label">Chart Title</label>
          <input
            type="text"
            className="input"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder="Enter chart title"
          />
        </div>
        <div>
          <label className="input-label">X-Axis</label>
          <select
            className="input"
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Y-Axis</label>
          <select
            className="input"
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
          >
            {numericColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Series Column</label>
          <select
            className="input"
            value={seriesKey}
            onChange={(e) => setSeriesKey(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">
            Series per <code>{seriesKey}</code>
          </label>
          {lines.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No {seriesKey} series found in data
            </p>
          )}

          {lines.map((line, index) => (
            <div
              key={line.dataKey}
              className="flex items-center gap-2 mb-2 group"
            >
              <input
                type="checkbox"
                checked={line.active}
                onChange={() => toggleLineVisibility(index)}
                className="hidden"
                id={line.dataKey}
              />

              {/* Color Picker with dim + disable when inactive */}
              <ColorPicker
                value={line.color}
                onChange={(val) => handleChangeColor(index, val)}
                disabled={!line.active}
                className={!line.active ? "opacity-40 pointer-events-none" : ""}
              />

              {/* Clickable Label */}
              <label
                htmlFor={line.dataKey}
                className={`text-sm cursor-pointer transition-all w-full py-2 ${
                  !line.active ? "line-through text-muted-foreground" : ""
                }`}
              >
                {line.dataKey}
              </label>
            </div>
          ))}
        </div>
        <SaveToDashboardModal
          open={open}
          onClose={() => setOpen(false)}
          chart={{
            title: chartTitle,
            type: chartType || null,
            config: { xKey, bars: activeLines },
            data: chartData,
          }}
        />
        <button onClick={() => setOpen(true)} className="btn-primary text-sm">
          Save to Dashboard
        </button>
      </div>
    </>
  );
}
