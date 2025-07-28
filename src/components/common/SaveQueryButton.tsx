import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertBox } from "./AlertBox";
import { FaSave } from "react-icons/fa";

interface SaveQueryButtonProps {
  sql: string;
}

const SaveQueryButton: React.FC<SaveQueryButtonProps> = ({ sql }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError("");

    const response = await window.ipcRenderer.invoke("save-query", {
      name,
      description,
      sql,
    });

    setSaving(false);

    if (response.success) {
      setSuccess(true);
      timerRef.current = setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setName("");
        setDescription("");
      }, 2000);
    } else {
      setError(response.message || "Failed to save query.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccess(false);
    setSaving(false);
    setName("");
    setDescription("");
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !success && setOpen(val)}>
      <DialogTrigger asChild>
        <button className="btn-outline text-xs flex gap-2 items-center">
          <FaSave className="w-4 h-4" />
          Save Query
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Query</DialogTitle>
          <DialogDescription>
            Give your query a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input
              type="text"
              className="input bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Description</label>
            <textarea
              className="input bg-white"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {success && (
            <AlertBox message="Query saved successfully!" type="success" />
          )}
          {error && <AlertBox message={error} type="error" />}
        </div>

        <DialogFooter>
          <button onClick={handleClose} className="btn-outline text-xs w-full">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs hover:bg-blue-700 disabled:opacity-50 w-full"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveQueryButton;
