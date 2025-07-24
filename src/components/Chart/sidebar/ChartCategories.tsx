import { chartMeta } from "@/data/chartMeta";

interface Props {
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}

export default function ChartCategories({
  activeCategoryId,
  setActiveCategoryId,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Chart Categories</h2>
      </div>
      <nav
        className="pl-10"
        role="tablist"
        aria-label="Chart categories"
      >
        {chartMeta.map((cat) => {
          const isActive = activeCategoryId === cat.categoryId;

          return (
            <button
              key={cat.categoryId}
              role="tab"
              aria-selected={isActive}
              aria-controls={`category-${cat.categoryId}`}
              className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-md transition cursor-pointer 
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                const el = document.getElementById(
                  `category-${cat.categoryId}`
                );
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveCategoryId(cat.categoryId); // optional: instantly reflect click
              }}
            >
              {/* <Icon className="w-4 h-4" /> */}
              <span>{cat.categoryTitle}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
