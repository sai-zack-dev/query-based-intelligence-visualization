import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartTemplateProps } from "@/types/chart";

interface Props {
  open: boolean;
  onClose: () => void;
  chart: {
    title: string;
    type: string | null;
    config: ChartTemplateProps;
    data: any[];
  };
}

interface Dashboard {
  id: number;
  name: string;
}

export default function SaveToDashboardModal({ open, onClose, chart }: Props) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      window.ipcRenderer.invoke("get-dashboards").then(setDashboards);
    }
  }, [open]);

  const handleCreateDashboard = async () => {
    if (!newName.trim()) return;
    const id = await window.ipcRenderer.invoke(
      "create-dashboard",
      newName.trim()
    );
    const newDashboard = { id, name: newName.trim() };
    setDashboards((prev) => [...prev, newDashboard]);
    setSelectedId(id);
    setNewName("");
    setCreatingNew(false);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;

    const result = await window.ipcRenderer.invoke("save-chart", chart);
    if (!result.success) {
      console.error(result.message);
      return;
    }

    const chartId = result.id;
    // console.log("Chart saved with ID:", chartId, "to dashboard ID:", selectedId);

    await window.ipcRenderer.invoke("link-chart-to-dashboard", {
      chartId,
      dashboardId: selectedId,
    });

    onClose();
    navigate(`/dashboard`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Dashboard</DialogTitle>
          <DialogDescription>
            Select or create a dashboard to add your chart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {dashboards.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`p-2 rounded border cursor-pointer ${
                selectedId === d.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              {d.name}
            </div>
          ))}

          {creatingNew ? (
            <div className="flex items-center gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New dashboard name"
              />
              <Button
                size="icon"
                onClick={handleCreateDashboard}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setCreatingNew(true)}
            >
              <PlusIcon className="mr-2 w-4 h-4" /> Add new dashboard
            </Button>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
