import React from "react";
import { ConnectionData, ConnectionType } from "@/types/connection";
import { useConnectionForm } from "@/hooks/useConnectionForm";
import { AlertBox } from "@/components/common/AlertBox";
import { ConnectionTypeSelector } from "./main/ConnectionTypeSelector";
import { ConnectionNameInput } from "./main/ConnectionNameInput";
import { ConnectionInputs } from "./main/ConnectionInputs";
import { ConnectionFormButtons } from "./main/ConnectionFormButtons";
import { DialogType } from "@/hooks/useConnectionForm";

interface Props {
  selectedConnection: ConnectionData | null;
  onTypeChange?: (type: ConnectionType) => void;
  onDialogTrigger?: (
    type: DialogType,
    title: string,
    message: string,
    onAction?: (action: string) => void
  ) => void;
}

export const ConnectionForm: React.FC<Props> = ({
  selectedConnection,
  onTypeChange,
  onDialogTrigger,
}) => {
  const {
    connectionType,
    setConnectionType,
    fileName,
    setFileName,
    formData,
    setFormData,
    status,
    handleTestConnection,
    handleSubmit,
  } = useConnectionForm(selectedConnection, onDialogTrigger); // <-- Pass dialog trigger

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (type: ConnectionType) => {
    setConnectionType(type);
    onTypeChange?.(type);
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
            fileName={fileName || ""}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
          />
        )}

        {status.type && (
          <AlertBox type={status.type} message={status.message} />
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
