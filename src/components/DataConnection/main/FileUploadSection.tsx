import React, { useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { ConnectionType } from "@/types/connection";

interface Props {
  connectionType: ConnectionType;
  fileNames: string[];
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement> | File[]
  ) => void;
}

export const FileUploadSection: React.FC<Props> = ({
  connectionType,
  fileNames,
  onFileChange,
}) => {
  const getFileAcceptType = () => {
    switch (connectionType) {
      case "excel":
        return "xlsx";
      case "csv":
        return "csv";
      case "sqlite":
        return "db";
      default:
        return "*";
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const templateLink = `/template/${connectionType}_template.${getFileAcceptType()}`;
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      onFileChange(files); // now valid
    },
    [onFileChange]
  );
  

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);
  return (
    <>
      <div className="flex items-center justify-between">
        <label className="input-label">
          Import File (.{getFileAcceptType()})
        </label>
        {connectionType !== "sqlite" && (
          <a href={templateLink} className="text-xs text-blue-600 underline">
            Download {capitalize(connectionType)} Template
          </a>
        )}
      </div>
      <label
        className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FiUploadCloud className="text-3xl mb-2" />
        <label className="cursor-pointer">
          {fileNames.length > 0 ? (
            <ul className="text-gray-700 text-sm font-medium space-y-1">
              {fileNames.map((name, idx) => (
                <li key={idx}>📄 {name}</li>
              ))}
            </ul>
          ) : (
            "Drag and Drop or Browse Files"
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={`.${getFileAcceptType()}`}
          multiple
          onChange={onFileChange}
        />
      </label>
    </>
  );
};
