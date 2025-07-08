import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { ConnectionType } from "@/types/connection";

interface Props {
  connectionType: ConnectionType;
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadSection: React.FC<Props> = ({
  connectionType,
  fileName,
  onFileChange,
}) => {
  const getFileAcceptType = () => {
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

  return (
    <>
      <div className="flex items-center justify-between">
        <label className="input-label">
          Import File ({getFileAcceptType()})
        </label>
        {connectionType !== "sqlite" && (
          <a href="#" className="text-xs text-blue-600 underline">
            Download {capitalize(connectionType)} Template
          </a>
        )}
      </div>
      <label
        className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
        htmlFor="file-upload"
      >
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
          accept={getFileAcceptType()}
          onChange={onFileChange}
        />
      </label>
    </>
  );
};