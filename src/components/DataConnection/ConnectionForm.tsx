import React from "react";
import { useDataConnection } from "@/context/DataConnectionContext";
import { AlertBox, AlertType } from "@/components/common/AlertBox";
import { ConnectionTypeSelector } from "./main/ConnectionTypeSelector";
import { ConnectionNameInput } from "./main/ConnectionNameInput";
import { ConnectionInputs } from "./main/ConnectionInputs";
import { ConnectionFormButtons } from "./main/ConnectionFormButtons";
import { ConnectionType } from "@/types/connection";

export const ConnectionForm: React.FC = () => {
  const {
    connectionType,
    setConnectionType,
    formData,
    setFormData,
    fileNames,
    setFileNames,
    status,
    handleTestConnection,
    handleSubmit,
  } = useDataConnection();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | File[]
  ) => {
    const files = Array.isArray(e)
      ? e
      : Array.from(e.target.files || []);
    setFileNames(files.map((f) => f.name));
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (type: ConnectionType) => {
    setConnectionType(type);
  };

  const handleNameChange = (name: string) => {
    handleFormChange("name", name);
  };

  return (
    <div className="p-6 pt-3 mr-6 rounded-xl bg-white shadow flex-grow">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Connection</h2>
      </div>

      <div className="flex flex-col gap-3">
        <ConnectionTypeSelector
          connectionType={connectionType as ConnectionType}
          onTypeChange={handleTypeChange}
        />

        {connectionType && (
          <ConnectionNameInput
            name={formData.name}
            onNameChange={handleNameChange}
          />
        )}

        {connectionType && (
          <ConnectionInputs
            connectionType={connectionType as ConnectionType}
            formData={formData}
            fileNames={fileNames || []}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
          />
        )}

        {status.type && (
          <AlertBox type={status.type as AlertType} message={status.message} />
        )}

        {connectionType && (
          <ConnectionFormButtons
            connectionType={connectionType as ConnectionType}
            onTestConnection={handleTestConnection}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};
