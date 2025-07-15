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
    <div className="flex justify-end mt-3 gap-2">
      <button
        type="button"
        className="btn-outline w-1/2 md:w-auto text-xs"
        onClick={onTestConnection}
      >
        {isFileImport ? "Test Template" : "Test Connection"}
      </button>
      <button
        type="submit"
        className="btn-primary w-1/2 md:w-auto text-xs flex justify-center items-center gap-2"
        onClick={onSubmit}
      >
        <FaSave />
        {isFileImport ? "Save and Import" : "Save and Connect"}
      </button>
    </div>
  );
};