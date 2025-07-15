import { ENTITIES } from "@/mock/MockData";

export const ManualPanel = () => {

  return (
    <>
      {/* Query Builder */}
      <div className="mt-4">
        {/* Select */}
        <div>
          <div className="flex justify-between">
            <span className="font-semibold text-sm">SELECT Columns</span>
            <div className="flex gap-2 text-xs items-center">
              <input type="checkbox" name="all" id="all" />
              <label htmlFor="all">All Columns (*)</label>
            </div>
          </div>

          <div>
            {
              Object.entries(ENTITIES).map(([table, columns]) => (
                <div key={table}>
                  {columns.length > 0 && 
                    columns.map((col, idx) => (
                      <div key={idx}>{col.name}</div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>

      </div>

      {/* Query Result */}
    </>
  );
};
