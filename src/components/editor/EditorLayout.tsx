
import React, { useState } from "react";
import { Toolbox } from "./Toolbox";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const EditorLayout: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  
  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10);
    } else {
      toast.info("Maximum zoom reached");
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10);
    } else {
      toast.info("Minimum zoom reached");
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
        <h1 className="text-xl font-bold">Graphic Editor</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Undo">
            <Undo className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="Redo">
            <Redo className="h-5 w-5" />
          </Button>
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Toolbox activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="flex-1 bg-gray-200 overflow-auto p-4 flex items-center justify-center">
          <Canvas 
            activeTool={activeTool} 
            zoom={zoom} 
            setSelectedObject={setSelectedObject} 
          />
        </div>
        <PropertiesPanel selectedObject={selectedObject} />
      </div>
      <div className="p-2 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-500">Project Name</div>
        <div className="flex items-center gap-2 text-sm">
          <span>Dimensions: 1920×1080</span>
          <span className="py-1 px-2 bg-blue-600 text-white rounded text-xs">In Progress</span>
        </div>
      </div>
    </div>
  );
};
