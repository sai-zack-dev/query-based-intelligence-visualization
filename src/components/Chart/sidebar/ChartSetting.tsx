import { ColorPicker } from "@/components/ui/color-picker";
import { useChart } from "@/context/ChartContext";
import { Button } from "@/components/ui/button";

export default function ChartSetting() {
  const { lines, setLines } = useChart();

  const handleChangeDataKey = (index: number, newKey: string) => {
    const updated = [...lines];
    updated[index].dataKey = newKey;
    setLines(updated);
  };

  const handleChangeColor = (index: number, newColor: string) => {
    const updated = [...lines];
    updated[index].stroke = newColor;
    setLines(updated);
  };

  const addLine = () => {
    setLines([
      ...lines,
      { dataKey: "", stroke: "#00ccff" }, // Default new line
    ]);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Chart Setting</h2>
      </div>

      <div className="pl-10 gap-4 flex flex-col">
        <div>
          <label className="input-label">Chart Name</label>
          <input className="input" placeholder="Enter chart name" />
        </div>

        <div>
          <label className="input-label">Values (Y-Axis)</label>
          {lines.map((line, index) => (
            <div key={index} className="flex gap-2 items-start mb-2">
              <ColorPicker
                value={line.stroke}
                onChange={(val) => handleChangeColor(index, val)}
              />
              <input
                className="input"
                placeholder={`Line ${index + 1}`}
                value={line.dataKey}
                onChange={(e) =>
                  handleChangeDataKey(index, e.target.value)
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-fit mt-1"
            onClick={addLine}
          >
            + Add Line
          </Button>
        </div>
      </div>
    </>
  );
}
