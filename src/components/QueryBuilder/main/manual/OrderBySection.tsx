// @/components/QueryBuilder/main/manual/OrderBySection.tsx
import React from "react";
import { FaCircleXmark } from "react-icons/fa6";

interface OrderBy {
  column: string;
  direction: "ASC" | "DESC";
}

interface OrderBySectionProps {
  orderBy: OrderBy[];
  setOrderBy: (orderBy: OrderBy[]) => void;
  orderableOptions: string[];
}

const OrderBySection: React.FC<OrderBySectionProps> = ({
  orderBy,
  setOrderBy,
  orderableOptions,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm">ORDER BY</span>
        <button
          className="text-xs text-blue-500 mt-2"
          onClick={() =>
            setOrderBy([...orderBy, { column: "", direction: "ASC" }])
          }
        >
          + Add Order By
        </button>
      </div>
      {orderBy.map((item, idx) => (
        <div key={idx} className="flex gap-2 mt-2 items-center">
          <select
            className="input"
            value={item.column}
            onChange={(e) => {
              const updated = [...orderBy];
              updated[idx].column = e.target.value;
              setOrderBy(updated);
            }}
          >
            <option value="">-- Column or Alias --</option>
            {orderableOptions.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={item.direction}
            onChange={(e) => {
              const updated = [...orderBy];
              updated[idx].direction = e.target.value as "ASC" | "DESC";
              setOrderBy(updated);
            }}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
          <button
            className="text-red-500"
            onClick={() => setOrderBy(orderBy.filter((_, i) => i !== idx))}
          >
            <FaCircleXmark className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderBySection;
