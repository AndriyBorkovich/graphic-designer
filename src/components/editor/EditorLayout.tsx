
import React, { useState } from "react";
import { Toolbox } from "./Toolbox";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface Layer {
  id: string;
  name: string;
  type: 'background' | 'shape' | 'text' | 'image' | 'adjustment';
  visible: boolean;
  object: fabric.Object;
}

export const EditorLayout: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
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
  
  const handleObjectUpdate = (property: string, value: any) => {
    if (!selectedObject) return;
    
    // Update the selected object in the canvas
    selectedObject.set({ [property]: value });
    
    // Update the object in the state
    setSelectedObject(selectedObject);
    
    // Render the canvas
    if (selectedObject.canvas) {
      selectedObject.canvas.renderAll();
    }
  };

  // Layer management functions
  const handleLayerSelect = (layerId: string) => {
    setActiveLayerId(layerId);
    const layer = layers.find(l => l.id === layerId);
    if (layer && layer.type !== 'background') {
      setSelectedObject(layer.object);
    } else {
      setSelectedObject(null);
    }
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible } 
          : layer
      )
    );
  };

  const handleLayerAdd = () => {
    // This is a placeholder. In a real app, you'd show a dialog to select layer type
    toast.info("Layer adding functionality to be implemented");
  };

  const handleLayerDelete = (layerId: string) => {
    const layerToDelete = layers.find(l => l.id === layerId);
    
    if (!layerToDelete) return;
    
    // Can't delete background
    if (layerToDelete.type === 'background') {
      toast.error("Cannot delete background layer");
      return;
    }
    
    // Remove the object from canvas
    if (layerToDelete.object.canvas) {
      layerToDelete.object.canvas.remove(layerToDelete.object);
    }
    
    // Remove the layer from state
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    
    // Clear selection if the deleted layer was selected
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
      setSelectedObject(null);
    }
    
    toast.success("Layer deleted");
  };

  const handleLayerMoveUp = (layerId: string) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < layers.length - 1 && layerIndex !== -1) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex + 1];
      newLayers[layerIndex + 1] = temp;
      
      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== 'background') {
        temp.object.bringForward();
      }
      
      setLayers(newLayers);
    }
  };

  const handleLayerMoveDown = (layerId: string) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex > 0) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex - 1];
      newLayers[layerIndex - 1] = temp;
      
      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== 'background') {
        temp.object.sendBackwards();
      }
      
      setLayers(newLayers);
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
          <Button
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:bg-red-50"
            onClick={() => {
              if (selectedObject && selectedObject.canvas) {
                const canvas = selectedObject.canvas;
                canvas.remove(selectedObject);
                setSelectedObject(null);
                
                // Remove the corresponding layer
                const layerToRemove = layers.find(l => l.object === selectedObject);
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
      <div className="flex flex-1 overflow-hidden">
        <Toolbox activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="flex-1 bg-gray-200 overflow-auto p-4 flex items-center justify-center">
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
        <PropertiesPanel 
          selectedObject={selectedObject}
          onObjectUpdate={handleObjectUpdate}
          layers={layers}
          activeLayerId={activeLayerId}
          onLayerSelect={handleLayerSelect}
          onLayerVisibilityToggle={handleLayerVisibilityToggle}
          onLayerAdd={handleLayerAdd}
          onLayerDelete={handleLayerDelete}
          onLayerMoveUp={handleLayerMoveUp}
          onLayerMoveDown={handleLayerMoveDown}
        />
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
