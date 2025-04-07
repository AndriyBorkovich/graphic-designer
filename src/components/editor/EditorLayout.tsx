
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "./Canvas";
import { SidebarNav } from "./SidebarNav";
import { ToolsTab } from "./ToolsTab";
import { ColorsTab } from "./ColorsTab";
import { LayersTab } from "./LayersTab";
import { Undo, Redo, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useHistoryManager } from "@/hooks/useHistoryManager";

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
  projectId?: string;
  projectName?: string;
  initialCanvasData?: string | null;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  activeTool = "select",
  setActiveTool,
  projectId,
  projectName = "Untitled Project",
  initialCanvasData,
}) => {
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [eraserWidth, setEraserWidth] = useState<number>(20);
  
  // Get the history manager hook
  const { 
    canUndo, 
    canRedo, 
    pushState, 
    undo, 
    redo, 
    currentState
  } = useHistoryManager();

  // Text properties
  const [textProperties, setTextProperties] = useState<{
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: "" | "normal" | "italic" | "oblique";
    underline: boolean;
    textAlign: string;
  }>({
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
  });

  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 10));
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  // Canvas initialization handler
  const handleCanvasInitialized = useCallback((canvasInstance: fabric.Canvas) => {
    setFabricCanvas(canvasInstance);
    
    // Set up event listeners for history tracking
    if (canvasInstance) {
      let ignoreObjectModified = false;
      let isFirstRender = true;
      
      // Save initial state after canvas is properly rendered
      setTimeout(() => {
        if (isFirstRender) {
          const initialCanvasState = JSON.stringify(
            canvasInstance.toJSON(['id', 'name', 'type', 'visible'])
          );
          pushState(initialCanvasState);
          isFirstRender = false;
        }
      }, 500);

      // Track object modifications
      canvasInstance.on('object:modified', () => {
        if (ignoreObjectModified) return;
        
        const currentCanvasState = JSON.stringify(
          canvasInstance.toJSON(['id', 'name', 'type', 'visible'])
        );
        pushState(currentCanvasState);
      });

      // Track object additions
      canvasInstance.on('object:added', () => {
        const currentCanvasState = JSON.stringify(
          canvasInstance.toJSON(['id', 'name', 'type', 'visible'])
        );
        pushState(currentCanvasState);
      });

      // Track object removals
      canvasInstance.on('object:removed', () => {
        const currentCanvasState = JSON.stringify(
          canvasInstance.toJSON(['id', 'name', 'type', 'visible'])
        );
        pushState(currentCanvasState);
      });
    }
  }, [pushState]);

  // Handle undo with improved canvas state restoration
  const handleUndo = useCallback(() => {
    if (!fabricCanvas || !canUndo) return;
    
    try {
      // Get previous state from history manager
      const previousState = undo();
      if (!previousState) return;
      
      // Parse the state and load it into canvas
      fabricCanvas.loadFromJSON(JSON.parse(previousState), () => {
        fabricCanvas.renderAll();
        toast.info("Undo successful");
        
        // Update layers based on current canvas objects
        updateLayersFromCanvas(fabricCanvas);
      });
    } catch (error) {
      console.error("Error during undo:", error);
      toast.error("Failed to undo");
    }
  }, [fabricCanvas, canUndo, undo]);

  // Handle redo with improved canvas state restoration
  const handleRedo = useCallback(() => {
    if (!fabricCanvas || !canRedo) return;
    
    try {
      // Get next state from history manager
      const nextState = redo();
      if (!nextState) return;
      
      // Parse the state and load it into canvas
      fabricCanvas.loadFromJSON(JSON.parse(nextState), () => {
        fabricCanvas.renderAll();
        toast.info("Redo successful");
        
        // Update layers based on current canvas objects
        updateLayersFromCanvas(fabricCanvas);
      });
    } catch (error) {
      console.error("Error during redo:", error);
      toast.error("Failed to redo");
    }
  }, [fabricCanvas, canRedo, redo]);

  // Function to update layers state based on canvas objects
  const updateLayersFromCanvas = (canvas: fabric.Canvas) => {
    const objects = canvas.getObjects();
    const newLayers: Layer[] = objects.map((obj: any) => {
      return {
        id: obj.id || Math.random().toString(36).substr(2, 9),
        name: obj.name || getObjectTypeName(obj),
        type: getLayerType(obj),
        visible: obj.visible !== false,
        object: obj,
      };
    });
    
    // Add background layer if not present
    if (!newLayers.find(l => l.type === "background")) {
      newLayers.unshift({
        id: "background",
        name: "Background",
        type: "background",
        visible: true,
        object: canvas as unknown as fabric.Object,
      });
    }
    
    setLayers(newLayers);
  };

  // Determine object type name for layer display
  const getObjectTypeName = (obj: fabric.Object): string => {
    if (obj instanceof fabric.Rect) return "Rectangle";
    if (obj instanceof fabric.Circle) return "Circle";
    if (obj instanceof fabric.Text) return "Text";
    if (obj instanceof fabric.Image) return "Image";
    if (obj instanceof fabric.Path) return "Path";
    return "Shape";
  };

  // Determine layer type from object
  const getLayerType = (obj: fabric.Object): Layer["type"] => {
    if (obj instanceof fabric.Rect || obj instanceof fabric.Circle || obj instanceof fabric.Path) {
      return "shape";
    }
    if (obj instanceof fabric.Text) {
      return "text";
    }
    if (obj instanceof fabric.Image) {
      return "image";
    }
    return "shape";
  };

  // Handle keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        
        if (e.shiftKey) {
          // Ctrl/Cmd + Shift + Z -> Redo
          handleRedo();
        } else {
          // Ctrl/Cmd + Z -> Undo
          handleUndo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle text property changes
  const handleTextPropertyChange = (property: string, value: any) => {
    setTextProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "tools":
        return (
          <ToolsTab 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            brushColor={brushColor}
            brushWidth={brushWidth}
            onBrushColorChange={setBrushColor}
            onBrushWidthChange={setBrushWidth}
            eraserWidth={eraserWidth}
            onEraserWidthChange={setEraserWidth}
            textProperties={textProperties}
            onTextPropertyChange={handleTextPropertyChange}
          />
        );
      case "colors":
        return <ColorsTab />;
      case "layers":
        return (
          <LayersTab
            layers={layers}
            setLayers={setLayers}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 h-full">
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className="h-full"
      />
      <div className="flex-1 flex flex-col bg-[#171717] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleUndo} disabled={!canUndo}>
              <Undo className="w-4 h-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleRedo} disabled={!canRedo}>
              <Redo className="w-4 h-4" />
              <span className="sr-only">Redo</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                className="w-16 h-9 bg-gray-800 text-white border-gray-700"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <Slider
                min={10}
                max={200}
                step={10}
                value={[zoom]}
                onValueChange={(value) => handleZoomChange(value)}
                className="w-24"
              />
            </div>
          </div>
          <div>{/* Right side toolbar items if needed */}</div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className={`transition-all duration-300 ${
            activeTab === "tools" || activeTab === "colors" || activeTab === "layers" 
              ? "w-72 min-w-72" 
              : "w-0 min-w-0"
            } bg-[#2A2A2A] overflow-hidden`}>
            <ScrollArea className="h-full p-4">
              {renderActiveTabContent()}
            </ScrollArea>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 relative">
              <Canvas
                activeTool={activeTool}
                zoom={zoom}
                setSelectedObject={setSelectedObject}
                setLayers={setLayers}
                layers={layers}
                activeLayerId={activeLayerId}
                setActiveLayerId={setActiveLayerId}
                onCanvasInitialized={handleCanvasInitialized}
                brushColor={brushColor}
                brushWidth={brushWidth}
                eraserWidth={eraserWidth}
                textProperties={textProperties}
              />
            </div>
            <div className="h-10 border-t border-gray-700 p-2 text-white text-sm flex items-center justify-between">
              <p>
                Selected object:{" "}
                {selectedObject.length > 0
                  ? selectedObject.length > 1
                    ? `${selectedObject.length} objects`
                    : selectedObject[0].type
                  : "None"}
              </p>
              <p>Zoom: {zoom}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
