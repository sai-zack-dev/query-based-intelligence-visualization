import { ColorPicker } from "@/components/ui/color-picker";
import { Switch } from "@/components/ui/switch";
import { useChart } from "@/context/ChartContext";
import { ChartName } from "@/types/chart";
import React, { useEffect, useMemo } from "react";

interface Props {
  chartType: ChartName;
}

export default function SettingForms({ chartType }: Props) {
  const { chartConfig, setChartConfig, resultData } = useChart();
  const bars = chartConfig?.bars ?? [];
  const columns = Object.keys(resultData?.[0] || {});
  const numericColumns = columns.filter((key) =>
    resultData.some(
      (row) => typeof row[key] === "number" || !isNaN(parseFloat(row[key]))
    )
  );
  const uniqueSeries = useMemo(() => {
    if (!resultData || !chartConfig?.barsKey) return [];
    return Array.from(
      new Set(resultData.map((row) => row[chartConfig.barsKey!]))
    );
  }, [resultData, chartConfig?.barsKey]);
  // Auto-generate bars when barsKey changes
  useEffect(() => {
    if (!chartConfig?.barsKey || uniqueSeries.length === 0) return;

    setChartConfig((prev) => {
      const existingBars = prev?.bars ?? [];
      const updatedBars = uniqueSeries.map((key, idx) => {
        const existing = existingBars.find((b) => b.dataKey === key);
        return {
          dataKey: key,
          fill: existing?.fill || defaultColor(idx),
          active: existing?.active ?? true,
        };
      });

      return {
        ...prev!,
        bars: updatedBars,
      };
    });
  }, [chartConfig?.barsKey, uniqueSeries]);
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
  const toggleBarVisibility = (index: number) => {
    setChartConfig((prev) => {
      if (!prev?.bars) return prev;

      const updatedBars = [...prev.bars];

      // === Enforce TinyBar: only 1 active bar ===
      if (chartType === "TinyBar") {
        updatedBars.forEach((bar, i) => {
          bar.active = i === index;
        });
      } else {
        updatedBars[index].active = !updatedBars[index].active;
      }

      return {
        ...prev,
        bars: updatedBars,
      };
    });
  };

  const handleChangeBarColor = (index: number, newColor: string) => {
    setChartConfig((prev) => {
      const updatedBars = [...(prev?.bars ?? [])];
      updatedBars[index].fill = newColor;
      return {
        ...prev!,
        bars: updatedBars,
      };
    });
  };
  return (
    <>
      {(chartType === "TinyBar" ||
        chartType === "SimpleBar" ||
        chartType === "StackedBar") && (
        <>
          <div>
            <label className="input-label flex w-full justify-between">
              X-Axis{" "}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">visibility</span>
                <Switch
                  checked={chartConfig?.xAxis ?? false}
                  onCheckedChange={(checked) =>
                    setChartConfig((prev) => ({
                      ...prev!,
                      xAxis: checked,
                    }))
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </label>
            <select
              className="input"
              value={chartConfig?.xKey}
              onChange={(e) =>
                setChartConfig((prev) => ({
                  ...prev!,
                  xKey: e.target.value,
                }))
              }
            >
              <option disabled selected>
                {" "}
                --- Select X-Axis column ---{" "}
              </option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label flex w-full justify-between">
              Y-Axis{" "}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">visibility</span>
                <Switch
                  checked={chartConfig?.yAxis ?? false}
                  onCheckedChange={(checked) =>
                    setChartConfig((prev) => ({
                      ...prev!,
                      yAxis: checked,
                    }))
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </label>
            <select
              className="input"
              value={chartConfig?.yKey}
              onChange={(e) =>
                setChartConfig((prev) => ({
                  ...prev!,
                  yKey: e.target.value,
                }))
              }
            >
              <option disabled selected>
                {" "}
                --- Select Y-Axis column ---{" "}
              </option>
              {numericColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Bar</label>
            <select
              className="input"
              value={chartConfig?.barsKey}
              onChange={(e) =>
                setChartConfig((prev) => ({
                  ...prev!,
                  barsKey: e.target.value,
                }))
              }
            >
              <option disabled selected>
                {" "}
                --- Select Bars column ---{" "}
              </option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          {/* Bar Configs */}
          {bars.length > 0 && (
            <div className="mt-4">
              <label className="input-label">Bar Series</label>
              {bars.map((bar, index) => (
                <div
                  key={bar.dataKey}
                  className="flex items-center gap-2 mb-2 group"
                >
                  <input
                    type="checkbox"
                    checked={bar.active}
                    onChange={() => toggleBarVisibility(index)}
                    className="hidden"
                    id={bar.dataKey}
                  />
                  <ColorPicker
                    value={bar.fill}
                    onChange={(val) => handleChangeBarColor(index, val)}
                    disabled={!bar.active}
                    className={
                      !bar.active ? "opacity-40 pointer-events-none" : ""
                    }
                  />
                  <label
                    htmlFor={bar.dataKey}
                    className={`text-sm cursor-pointer transition-all w-full py-2 ${
                      !bar.active ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {bar.dataKey}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <label className="flex-1 flex justify-between border p-2 items-center rounded-md">
              <label className="input-label" htmlFor="tooltip">
                Tooltips
              </label>
              <Switch
                className="data-[state=checked]:bg-green-500"
                onCheckedChange={(checked) =>
                  setChartConfig((prev) => ({
                    ...prev!,
                    tooltip: checked,
                  }))
                }
                id="tooltip"
              />
            </label>
            <label className="flex-1 flex justify-between border p-2 items-center rounded-md">
              <label className="input-label" htmlFor="legend">
                Legend
              </label>
              <Switch
                className="data-[state=checked]:bg-green-500"
                onCheckedChange={(checked) =>
                  setChartConfig((prev) => ({
                    ...prev!,
                    legend: checked,
                  }))
                }
                id="legend"
              />
            </label>
          </div>
        </>
        // xKey => select and check visibility
        // yAxis => select and check visibility
        // tooltip => toggle switch
        // bars => color, active,
        // notes => tinybar (only 1 active bar)
        // notes => stackedbar (setstackId "a" ++)
      )}
    </>
  );
}
