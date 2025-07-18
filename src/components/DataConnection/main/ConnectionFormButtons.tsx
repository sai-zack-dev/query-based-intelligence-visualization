import React from "react";
import { FaSave } from "react-icons/fa";
import { ConnectionType } from "@/types/connection";

interface Props {
  connectionType: ConnectionType;
  onTestConnection: () => void;
  onSubmit: () => void;
}

export const ConnectionFormButtons: React.FC<Props> = ({
  connectionType,
  onTestConnection,
  onSubmit,
}) => {
  const isFileImport = ["excel", "csv", "sqlite"].includes(connectionType);

  return (
    <div className="flex justify-end mt-3 gap-2 w-full">
      <button
        type="button"
        className="btn-outline text-xs md:text-sm flex-1 max-w-[200px]"
        onClick={onTestConnection}
      >
        {isFileImport ? "Test Template" : "Test Connection"}
      </button>
      <button
        type="submit"
        className="btn-primary text-xs md:text-sm flex-1 flex justify-center items-center gap-2 max-w-[200px]"
        onClick={onSubmit}
      >
        <FaSave className="w-4 h-4" />
        {isFileImport ? "Save and Import" : "Save and Connect"}
      </button>
    </div>
  );
};