import React, { useState } from "react";
import { Canvas } from "./Canvas";
import { SidePanel } from "./SidePanel";
import { SidebarNav } from "./SidebarNav";
import { ToolsTab } from "./ToolsTab";
import { ColorPickerTab } from "./ColorPickerTab";
import { LayersTab } from "./LayersTab";
import { Undo, Redo, ZoomIn, ZoomOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fabric } from "fabric";

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface EditorLayoutProps {
  activeTool?: string;
  setActiveTool: (tool: string) => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  activeTool = "select",
  setActiveTool,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tools");

  // Handle zoom in function
  const handleZoomIn = () => {
    try {
      if (zoom < 200) {
        setZoom(zoom + 10);
      } else {
        toast.info("Maximum zoom reached");
      }
    } catch (error) {
      console.error("Error zooming in:", error);
      toast.error("Error while zooming in");
    }
  };

  // Handle zoom out function
  const handleZoomOut = () => {
    try {
      if (zoom > 50) {
        setZoom(zoom - 10);
      } else {
        toast.info("Minimum zoom reached");
      }
    } catch (error) {
      console.error("Error zooming out:", error);
      toast.error("Error while zooming out");
    }
  };

  // Object update handler
  const handleObjectUpdate = (property: string, value: any) => {
    if (!selectedObject) return;

    // Update the selected object in the canvas
    selectedObject.set({ [property]: value });
    setSelectedObject(selectedObject);

    if (selectedObject.canvas) {
      selectedObject.canvas.renderAll();
    }
  };

  // Layer management functions
  const handleLayerSelect = (layerId: string) => {
    setActiveLayerId(layerId);
    const layer = layers.find((l) => l.id === layerId);
    if (layer && layer.type !== "background") {
      setSelectedObject(layer.object);
    } else {
      setSelectedObject(null);
    }
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleLayerAdd = () => {
    toast.info("Layer adding functionality to be implemented");
  };

  const handleLayerDelete = (layerId: string) => {
    const layerToDelete = layers.find((l) => l.id === layerId);

    if (!layerToDelete) return;

    // Can't delete background
    if (layerToDelete.type === "background") {
      toast.error("Cannot delete background layer");
      return;
    }

    // Remove the object from canvas
    if (layerToDelete.object.canvas) {
      layerToDelete.object.canvas.remove(layerToDelete.object);
    }

    // Remove the layer from state
    setLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.id !== layerId)
    );

    // Clear selection if the deleted layer was selected
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
      setSelectedObject(null);
    }

    toast.success("Layer deleted");
  };

  const handleLayerMoveUp = (layerId: string) => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex < layers.length - 1 && layerIndex !== -1) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex + 1];
      newLayers[layerIndex + 1] = temp;

      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== "background") {
        temp.object.bringForward();
      }

      setLayers(newLayers);
    }
  };

  const handleLayerMoveDown = (layerId: string) => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex > 0) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex - 1];
      newLayers[layerIndex - 1] = temp;

      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== "background") {
        temp.object.sendBackwards();
      }

      setLayers(newLayers);
    }
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "tools":
        return (
          <ToolsTab
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />
        );
      case "colors":
        return (
          <ColorPickerTab
            selectedObject={selectedObject}
            onColorChange={(property, color) => handleObjectUpdate(property, color)}
          />
        );
      case "layers":
        return (
          <LayersTab
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerSelect={handleLayerSelect}
            onLayerVisibilityToggle={handleLayerVisibilityToggle}
            onLayerAdd={handleLayerAdd}
            onLayerDelete={handleLayerDelete}
            onLayerMoveUp={handleLayerMoveUp}
            onLayerMoveDown={handleLayerMoveDown}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex">
        <div className="bg-gray-900 border-r border-gray-800">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="bg-gray-900 w-64 p-4 border-r border-gray-800">
          {renderActiveTabContent()}
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full">
        <div className="flex justify-between items-center p-2 border-b bg-gray-900 text-white">
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" title="Undo">
              <Undo className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Redo">
              <Redo className="h-5 w-5" />
            </Button>
            <div className="flex items-center border rounded-md border-gray-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-900/20"
              onClick={() => {
                if (selectedObject && selectedObject.canvas) {
                  const canvas = selectedObject.canvas;
                  canvas.remove(selectedObject);
                  setSelectedObject(null);

                  // Remove the corresponding layer
                  const layerToRemove = layers.find(
                    (l) => l.object === selectedObject
                  );
                  if (layerToRemove) {
                    handleLayerDelete(layerToRemove.id);
                  }

                  toast.success("Object deleted");
                }
              }}
              disabled={!selectedObject}
              title="Delete Selected"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-800">
          <div className="h-full w-full flex items-center justify-center">
            <Canvas
              activeTool={activeTool}
              zoom={zoom}
              setSelectedObject={setSelectedObject}
              layers={layers}
              setLayers={setLayers}
              activeLayerId={activeLayerId}
              setActiveLayerId={setActiveLayerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
