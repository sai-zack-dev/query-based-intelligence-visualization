import React, { useState } from "react";
import { FaFileCsv, FaFileExcel, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExportButtonProps {
  data: any[];
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename = "query_result" 
}) => {
  const [open, setOpen] = useState(false);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${filename}.json`);
    setOpen(false);
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${filename}.csv`);
    setOpen(false);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
    setOpen(false);
  };

  const triggerDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="btn-outline flex items-center gap-2 text-xs"
          disabled={!data || data.length === 0}
        >
          <FaDownload className="w-3 h-3" />
          Export As
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose the format you want to export your data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FaFileCsv className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-medium text-gray-800">CSV</div>
              <div className="text-xs text-gray-500">
                Comma-separated values, works with Excel and Google Sheets
              </div>
            </div>
          </button>

          <button
            onClick={exportExcel}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FaFileExcel className="w-6 h-6 text-green-700" />
            <div>
              <div className="font-medium text-gray-800">Excel</div>
              <div className="text-xs text-gray-500">
                Microsoft Excel format (.xlsx)
              </div>
            </div>
          </button>

          <button
            onClick={exportJSON}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FaDownload className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-medium text-gray-800">JSON</div>
              <div className="text-xs text-gray-500">
                JavaScript Object Notation, for developers
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};