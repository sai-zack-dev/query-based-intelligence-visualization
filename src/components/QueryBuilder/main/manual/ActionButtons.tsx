// @/components/QueryBuilder/main/manual/ActionButtons.tsx
import SaveQueryButton from "@/components/common/SaveQueryButton";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";
import React from "react";
import { FaChartArea, FaPlay } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
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
            <button className="btn-outline text-xs flex gap-2">
              <MdOutlineFileDownload className="w-5 h-5" />
              Export As
            </button>
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
