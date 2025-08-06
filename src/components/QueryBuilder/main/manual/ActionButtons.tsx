// @/components/QueryBuilder/main/manual/ActionButtons.tsx
import SaveQueryButton from "@/components/common/SaveQueryButton";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";
import React from "react";
import { FaChartArea, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ExportButton } from "@/components/common/ExportButton";

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
  const { sql } = useQueryBuilderContext();
  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <button
          className="btn-primary text-xs flex gap-2 items-center"
          disabled={disabled}
          onClick={onRun}
        >
          <FaPlay />
          Run Query
        </button>
        <SaveQueryButton sql={sql} />
      </div>

      <div className="flex gap-3">
        {resultData && resultData.length > 0 && (
          <>
            <ExportButton data={resultData || []} filename="query_result" />
            <button
              className="btn-primary text-xs flex gap-2"
              onClick={() =>
                navigate("/chart", {
                  state: { data: resultData },
                })
              }
            >
              <FaChartArea className="w-4 h-4" />
              Generate Chart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
