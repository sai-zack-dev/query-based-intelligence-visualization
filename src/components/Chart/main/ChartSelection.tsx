import { useEffect, useRef, useState } from "react";
import { useChart } from "@/context/ChartContext";
import { chartCategories, chartMeta } from "@/utils/chartMeta";
import { renderChartTemplate } from "@/components/common/ChartRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed
import { AlertBox } from "@/components/common/AlertBox";

const ChartSelection: React.FC = () => {
  const { setActiveCategoryId, chartType, setChartType, setActiveTab } =
    useChart();

  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const sections = container?.querySelectorAll("[data-category-id]");
    if (!container || !sections?.length) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute("data-category-id");
          if (id) setActiveCategoryId(id);
        }
      },
      {
        root: container,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.current?.observe(section));
    return () => observer.current?.disconnect();
  }, [setActiveCategoryId]);

  return (
    <>
      <div className="px-4">
        <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800">
          Chart Selection
        </h2>
      </div>
      <div ref={containerRef} className="space-y-10 p-4 h-[75vh] overflow-auto">
        {chartCategories.map((category) => {
          const chartsInCategory = chartMeta.filter(
            (chart) => chart.category === category.categoryId
          );

          return (
            <section
              key={category.categoryId}
              id={`category-${category.categoryId}`}
              data-category-id={category.categoryId}
            >
              <h2 className="text-xl font-bold mb-4 flex justify-center items-center gap-3">
                <category.categoryIcon className="w-6 h-6" />
                {category.categoryTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {chartsInCategory.map((chart) => (
                  <div
                    key={chart.id}
                    className={`rounded-lg hover:shadow-md cursor-pointer transition p-3 ${
                      chartType === chart.id
                        ? "bg-blue-50 border border-blue-300"
                        : "bg-gray-50"
                    }`}
                    // onClick={() => {
                    //   setChartType(chart.id);
                    //   setActiveTab("config");
                    // }}
                    onClick={() => {
                      if (category.categoryId === "bar") {
                        setChartType(chart.id);
                        setActiveTab("config");
                      } else {
                        setShowDialog(true);
                      }
                    }}
                  >
                    <div className="h-60">
                      {renderChartTemplate({
                        type: chart.id,
                        data: chart.demoData,
                        config: chart.demoConfig,
                      })}
                    </div>
                    <p className="text-center text-sm font-medium mt-2">
                      {chart.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-4">🚧 Feature Under Construction</DialogTitle>
            <DialogDescription>
              <AlertBox message="This chart type is currently under development and not yet
              available. Please select a supported chart type (e.g., Tiny Bar
              Chart, Simple Bar
              Chart, Stacked Bar
              Chart)." type="warning" />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button
                className="btn-primary"
                onClick={() => setShowDialog(false)}
              >
                Got it
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChartSelection;
