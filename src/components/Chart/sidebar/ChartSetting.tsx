import { useChart } from "@/context/ChartContext";
import { ColorPicker } from "@/components/ui/color-picker";
import { useEffect } from "react";

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
  } = useChart();

  const columns = Object.keys(resultData?.[0] || {});
  const numericColumns = columns.filter((key) =>
    resultData.some(
      (row) => typeof row[key] === "number" || !isNaN(parseFloat(row[key]))
    )
  );

  const defaultColor = (i: number) => {
    const hue = (i * 137.508) % 360; // Golden angle for even hue distribution
    return `hsl(${hue}, 65%, 55%)`; // Saturated mid-lightness colors
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
        stroke: existing?.stroke || defaultColor(idx),
        active: existing?.active ?? true, // ✅ visibility
      };
    });

    setLines(updated);
  }, [resultData, seriesKey]);

  // Handle color change
  const handleChangeColor = (index: number, newColor: string) => {
    const updated = [...lines];
    updated[index].stroke = newColor;
    setLines(updated);
  };

  // Handle checkbox toggle
  const toggleLineVisibility = (index: number) => {
    const updated = [...lines];
    updated[index].active = !updated[index].active;
    setLines(updated);
  };

  return (
    <>
      <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800 mb-3">
        Chart Preview
      </h2>
      <div className="pl-10 gap-4 flex flex-col">
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
          <label className="input-label">Y-Axis (Numeric)</label>
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
                value={line.stroke}
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
      </div>
    </>
  );
}
