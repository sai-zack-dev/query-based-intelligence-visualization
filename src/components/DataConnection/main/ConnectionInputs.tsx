import React from "react";
import { ConnectionType, FormData } from "@/types/connection";
import { MySQLConnectionInputs } from "./MySQLConnectionInputs";
import { FileUploadSection } from "./FileUploadSection";

interface Props {
  connectionType: ConnectionType;
  formData: FormData;
  fileNames: string[];
  onFormChange: (key: string, value: string) => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement> | File[]
  ) => void;
}

export const ConnectionInputs: React.FC<Props> = ({
  connectionType,
  formData,
  fileNames,
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
        fileNames={fileNames}
        onFileChange={onFileChange}
      />
    );
  }

  return null;
};