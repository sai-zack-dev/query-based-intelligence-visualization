import { useState } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

const initialLayout: Layout[] = [
  { i: "1", x: 0, y: 0, w: 3, h: 2 },
  { i: "2", x: 3, y: 0, w: 4, h: 4 },
  { i: "3", x: 7, y: 2, w: 2, h: 4 },
];

const MainArea = () => {
  const [isEdit, setIsEdit] = useState(true);
  return (
    <div className="relative overflow-y-auto flex-grow pt-3 px-2">
      <ReactGridLayout
        className="layout"
        layout={initialLayout}
        cols={12}
        rowHeight={30}
        containerPadding={[0, 0]}
        isResizable={isEdit}
        isDraggable={isEdit}
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
      >
        {initialLayout.map((item) => (
          <div key={item.i} className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`bg-blue-100 text-blue-500 text-sm text-center p-1 drag-handle ${isEdit && "cursor-move"}`}>
              Chart {item.i}
            </div>
            <div className="p-2">Chart content here...</div>
            <button onClick={() => setIsEdit(!isEdit)}>Toggle</button>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default MainArea;
