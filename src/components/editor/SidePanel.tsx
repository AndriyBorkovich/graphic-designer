import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPickerTab } from "./ColorPickerTab";
import { ToolPropertiesTab } from "./ToolPropertiesTab";
import { LayersTab } from "./LayersTab";
import { ToolsTab } from "./ToolsTab";
import { Palette, Layers, SlidersHorizontal, Box } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface PropertiesPanelProps {
  selectedObject: any;
  onObjectUpdate?: (property: string, value: any) => void;
  layers: Layer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
  onLayerMoveUp: (layerId: string) => void;
  onLayerMoveDown: (layerId: string) => void;
  activeTool?: string;
  setActiveTool?: (tool: string) => void;
}

export const SidePanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onObjectUpdate,
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerAdd,
  onLayerDelete,
  onLayerMoveUp,
  onLayerMoveDown,
  activeTool = "select",
  setActiveTool = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [brushSize, setBrushSize] = useState<number>(24);
  const [opacity, setOpacity] = useState<number>(100);
  const [blendMode, setBlendMode] = useState<string>("normal");

  // Handle color change
  const handleColorChange = (property: string, color: string) => {
    if (onObjectUpdate && selectedObject) {
      onObjectUpdate(property, color);
    }
  };

  // Handle brush size change
  const handleBrushSizeChange = (value: number[]) => {
    setBrushSize(value[0]);
  };

  // Handle opacity change
  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
  };

  // Handle blend mode change
  const handleBlendModeChange = (value: string) => {
    setBlendMode(value);
  };

  return (
    <div className="w-56 bg-gray-900 text-white flex flex-col">
      <div className="border-b border-gray-700 p-2 flex flex-col justify-around">
        <Button
          variant="ghost"
          size="icon"
          className={activeTab === "tools" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("tools")}
        >
          <Box className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={activeTab === "properties" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("properties")}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={activeTab === "colors" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("colors")}
        >
          <Palette className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={activeTab === "layers" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("layers")}
        >
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      <div className="overflow-y-auto flex-grow p-4">
        {/* Tools Tab */}
        {activeTab === "tools" && (
          <ToolsTab
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isDarkMode={true}
          />
        )}

        {activeTab === "layers" && (
          <div>
            <h3 className="font-medium text-lg mb-4">Layers</h3>
            <LayersTab
              layers={layers}
              activeLayerId={activeLayerId}
              onLayerSelect={onLayerSelect}
              onLayerVisibilityToggle={onLayerVisibilityToggle}
              onLayerAdd={onLayerAdd}
              onLayerDelete={onLayerDelete}
              onLayerMoveUp={onLayerMoveUp}
              onLayerMoveDown={onLayerMoveDown}
            />
          </div>
        )}

        {activeTab === "colors" && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">Colors</h3>
            <ColorPickerTab
              selectedObject={selectedObject}
              onColorChange={handleColorChange}
            />
          </div>
        )}

        {activeTab === "properties" && (
          <ToolPropertiesTab
            brushSize={brushSize}
            opacity={opacity}
            blendMode={blendMode}
            onBrushSizeChange={handleBrushSizeChange}
            onOpacityChange={handleOpacityChange}
            onBlendModeChange={handleBlendModeChange}
          />
        )}
      </div>
    </div>
  );
};
