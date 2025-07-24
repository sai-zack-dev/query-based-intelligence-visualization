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
    <nav className="p-4 space-y-2" role="tablist" aria-label="Chart categories">
      {chartMeta.map((cat) => {
        const Icon = cat.categoryIcon;
        const isActive = activeCategoryId === cat.categoryId;

        return (
          <button
            key={cat.categoryId}
            role="tab"
            aria-selected={isActive}
            aria-controls={`category-${cat.categoryId}`}
            className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded transition 
              ${isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-700"}`}
            onClick={() => {
              const el = document.getElementById(`category-${cat.categoryId}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              setActiveCategoryId(cat.categoryId); // optional: instantly reflect click
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.categoryTitle}</span>
          </button>
        );
      })}
    </nav>
  );
}
