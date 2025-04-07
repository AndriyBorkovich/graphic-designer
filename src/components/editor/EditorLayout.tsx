import React, { useState, useCallback } from "react";
import { SidebarNav } from "@/components/editor/SidebarNav";
import { ToolsTab } from "@/components/editor/ToolsTab";
import { ColorsTab } from "@/components/editor/ColorsTab";
import { LayersTab } from "@/components/editor/LayersTab";
import { Canvas } from "@/components/editor/Canvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditorLayoutProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  projectId?: string;
  projectName?: string;
  initialCanvasData?: string | null;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  activeTool,
  setActiveTool,
  projectId,
  projectName,
  initialCanvasData,
}) => {
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any>([]);
  const [layers, setLayers] = useState<any>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [canvasState, setCanvasState] = useState<fabric.Canvas | null>(null);
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [eraserWidth, setEraserWidth] = useState<number>(20);
  const [textProperties, setTextProperties] = useState({
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
  });

  // Zoom functions
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 10));
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  // Canvas initialization handler
  const handleCanvasInitialized = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvasInitialized(true);
    setCanvasState(canvasInstance);
  }, []);

  // Handle text property changes
  const handleTextPropertyChange = (property: string, value: any) => {
    setTextProperties((prev) => ({ ...prev, [property]: value }));
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
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M4.75 8.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.25-8a7.25 7.25 0 0114.5 0h-1.5a.75.75 0 000 1.5h1.5a7.25 7.25 0 01-14.5 0h1.5a.75.75 0 000-1.5h-1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M4.75 8.75a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5h-10.5z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.25-8a7.25 7.25 0 0114.5 0h-1.5a.75.75 0 000 1.5h1.5a7.25 7.25 0 01-14.5 0h1.5a.75.75 0 000-1.5h-1.5z"
                  clipRule="evenodd"
                />
              </svg>
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
          <div>
            {/* Add any other toolbar controls here */}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            className={`transition-all duration-300 ${
              activeTab === "tools" || activeTab === "colors" || activeTab === "layers"
                ? "w-72 min-w-72"
                : "w-0 min-w-0"
            } bg-[#2A2A2A] overflow-hidden`}
          >
            <ScrollArea className="h-full p-4">
              {activeTab === "tools" && (
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
              )}
              {activeTab === "colors" && <ColorsTab />}
              {activeTab === "layers" && (
                <LayersTab
                  layers={layers}
                  setLayers={setLayers}
                  activeLayerId={activeLayerId}
                  setActiveLayerId={setActiveLayerId}
                />
              )}
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
