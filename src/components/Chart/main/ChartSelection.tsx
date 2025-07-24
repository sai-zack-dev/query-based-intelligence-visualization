import { chartMeta } from "@/data/chartMeta";
import { useEffect, useRef } from "react";

interface Props {
  setActiveCategoryId: (id: string) => void;
}

const ChartSelection: React.FC<Props> = ({ setActiveCategoryId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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
        root: container, // ✅ this is the real scroll container
        rootMargin: "-40% 0px -40% 0px", // tweak for better sensitivity
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.current?.observe(section));

    return () => observer.current?.disconnect();
  }, [setActiveCategoryId]);

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Chart Selection</h2>
      </div>
      <div
        ref={containerRef}
        className="space-y-10 pr-4 h-[80vh] overflow-auto"
      >
        {chartMeta.map((category) => (
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
              {category.charts.map(({ id, name, Component }) => (
                <div
                  key={id}
                  className="border rounded-lg hover:shadow-md cursor-pointer transition p-3 bg-white"
                >
                  <div className="h-40">
                    <Component />
                  </div>
                  <p className="text-center text-sm font-medium mt-2">{name}</p>
                </div>
              ))}
              <hr />
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default ChartSelection;
