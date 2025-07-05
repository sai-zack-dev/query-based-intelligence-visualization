import React from "react";

interface Props {
  name: string;
  onNameChange: (name: string) => void;
}

export const ConnectionNameInput: React.FC<Props> = ({ name, onNameChange }) => {
  return (
    <div>
      <label className="input-label">Connection Name</label>
      <input
        className="input"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
    </div>
  );
};