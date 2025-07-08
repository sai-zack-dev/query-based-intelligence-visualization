import React from "react";
import { FormData } from "@/types/connection";

interface Props {
  formData: FormData;
  onFormChange: (key: string, value: string) => void;
}

export const MySQLConnectionInputs: React.FC<Props> = ({
  formData,
  onFormChange,
}) => {
  return (
    <>
      <div className="flex gap-3">
        <div className="w-full">
          <label className="input-label">Host</label>
          <input
            className="input"
            value={formData.host}
            onChange={(e) => onFormChange("host", e.target.value)}
          />
        </div>
        <div className="w-full">
          <label className="input-label">Port</label>
          <input
            className="input"
            value={formData.port}
            onChange={(e) => onFormChange("port", e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-full">
          <label className="input-label">Username</label>
          <input
            className="input"
            placeholder="e.g. root"
            value={formData.username}
            onChange={(e) => onFormChange("username", e.target.value)}
          />
        </div>
        <div className="w-full">
          <label className="input-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => onFormChange("password", e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
