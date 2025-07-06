import React from "react";
import { ConnectionType, FormData } from "../../../types/connection";
import { MySQLConnectionInputs } from "./MySQLConnectionInputs";
import { FileUploadSection } from "./FileUploadSection";

interface Props {
  connectionType: ConnectionType;
  formData: FormData;
  fileName: string;
  onFormChange: (key: string, value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ConnectionInputs: React.FC<Props> = ({
  connectionType,
  formData,
  fileName,
  onFormChange,
  onFileChange,
}) => {
  if (connectionType === "mysql") {
    return (
      <MySQLConnectionInputs
        formData={formData}
        onFormChange={onFormChange}
      />
    );
  }

  if (["excel", "csv", "sqlite"].includes(connectionType)) {
    return (
      <FileUploadSection
        connectionType={connectionType}
        fileName={fileName}
        onFileChange={onFileChange}
      />
    );
  }

  return null;
};