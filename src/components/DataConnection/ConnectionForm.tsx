import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaSave } from "react-icons/fa";

interface Props {
  sidebarActive: boolean;
}

export const ConnectionForm: React.FC<Props> = ({ sidebarActive }) => {
  const [connectionType, setConnectionType] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const renderConnectionInputs = () => {
    if (connectionType === "mysql") {
      return (
        <>
          <div className="flex gap-3">
            <div className="w-full">
              <label className="input-label">Host</label>
              <input className="input" placeholder="e.g. localhost" />
            </div>
            <div className="w-full">
              <label className="input-label">Port</label>
              <input className="input" placeholder="e.g. 3306" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <label className="input-label">Username</label>
              <input className="input" placeholder="e.g. root" />
            </div>
            <div className="w-full">
              <label className="input-label">Password</label>
              <input type="password" placeholder="Enter password" className="input" />
            </div>
          </div>
        </>
      );
    }

    if (["excel", "csv", "sqlite"].includes(connectionType)) {
      return (
        <>
          <div className="flex items-center justify-between">
            <label className="input-label">
              Import File ({fileExtensionLabel()})
            </label>
            {connectionType !== "sqlite" && (
              <a href="#" className="text-xs text-blue-600 underline">
                Download {capitalize(connectionType)} Template
              </a>
            )}
          </div>
          <label className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50 transition" htmlFor="file-upload">
            <FiUploadCloud className="text-3xl mb-2" />
            <label className="cursor-pointer">
              {fileName ? (
                <span className="text-gray-700 font-medium">{fileName}</span>
              ) : (
                "Drag and Drop or Browse File"
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={fileAcceptType()}
              onChange={handleFileChange}
            />
          </label>
        </>
      );
    }

    return null;
  };

  const fileExtensionLabel = () => {
    switch (connectionType) {
      case "excel":
        return ".xlsx, xls";
      case "csv":
        return ".csv";
      case "sqlite":
        return ".sqlite, .sqlite3, .db, .db3, .s3db, .sl3";
      default:
        return "";
    }
  };

  const fileAcceptType = () => {
    switch (connectionType) {
      case "excel":
        return ".xlsx";
      case "csv":
        return ".csv";
      case "sqlite":
        return ".db";
      default:
        return "*";
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const renderSubmitButton = () => {
    const isFileImport = ["excel", "csv", "sqlite"].includes(connectionType);
    return (
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          className="btn-outline w-1/2 md:w-auto text-xs"
        >
          {isFileImport ? "Test Template" : "Test Connection"}
        </button>
        <button
          type="submit"
          className="btn-primary w-1/2 md:w-auto text-xs flex justify-center items-center gap-2"
        >
          <FaSave />
          {isFileImport ? "Save and Import" : "Save and Connect"}
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 pt-3 mx-0 sm:mx-6 rounded-xl bg-white shadow transition-all duration-300 w-full">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Connection</h2>
      </div>

      <form className="flex flex-col space-y-3">
        {/* Type */}
        <div>
          <label className="input-label">Connection Type</label>
          <select
            className="input"
            value={connectionType}
            onChange={(e) => setConnectionType(e.target.value)}
          >
            <option value="">Select connection type</option>
            <option value="mysql">MySQL</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>

        {/* Common Name */}
        {connectionType && (
          <div>
            <label className="input-label">Connection Name</label>
            <input className="input" placeholder="Enter connection name" />
          </div>
        )}

        {/* Conditional Inputs */}
        {renderConnectionInputs()}

        {/* Submit Buttons */}
        {connectionType && renderSubmitButton()}
      </form>
    </div>
  );
};
