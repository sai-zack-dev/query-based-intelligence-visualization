import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogType } from "@/hooks/useConnectionForm";

interface ConnectionDialogProps {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  onAction: (action: string) => void;
  onCancel: () => void;
}

export const ConnectionDialog: React.FC<ConnectionDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  onAction,
  onCancel,
}) => {
  const renderFooter = () => {
    switch (type) {
      case "name-conflict":
        return (
          <DialogFooter>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => onAction("save")}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex-1"
            >
              Save Anyway
            </button>
          </DialogFooter>
        );

      case "config-conflict":
        return (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => onAction("update")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1"
            >
              Update
            </button>
            <button
              onClick={() => onAction("create")}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-1"
            >
              Create New
            </button>
          </DialogFooter>
        );

      case "validation-error":
        return (
          <DialogFooter>
            <button
              onClick={() => onAction("ok")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              OK
            </button>
          </DialogFooter>
        );

      default:
        return (
          <DialogFooter>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => onAction("ok")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1"
            >
              OK
            </button>
          </DialogFooter>
        );
    }
  };

  return (
    <div className="absolute">
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          {renderFooter()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
