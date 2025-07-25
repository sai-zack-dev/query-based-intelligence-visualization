// @/components/QueryBuilder/main/manual/ActionButtons.tsx
import React from "react";
import { FaChartArea } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  disabled: boolean;
  onRun: () => void;
  resultData?: any[] | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  disabled,
  onRun,
  resultData,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <button
        className="btn-primary text-xs"
        disabled={disabled}
        onClick={onRun}
      >
        ▶ Run Query
      </button>
      <div className="flex gap-3">
        {resultData && resultData.length > 0 && (
          <button
            className="btn-outline text-xs flex gap-2"
            onClick={() =>
              navigate("/chart", {
                state: { data: resultData },
              })
            }
          >
            <FaChartArea className="w-4 h-4" />
            Generate Chart
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
