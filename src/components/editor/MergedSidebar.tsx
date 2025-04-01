import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Layers, Settings, Box } from "lucide-react";
import { ColorPickerTab } from "./ColorPickerTab";
import { ToolPropertiesTab } from "./ToolPropertiesTab";
import { LayersTab } from "./LayersTab";
import { ToolsTab } from "./ToolsTab";
import { Separator } from "@/components/ui/separator";

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface MergedSidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
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
}

export const MergedSidebar: React.FC<MergedSidebarProps> = ({
  activeTool,
  setActiveTool,
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
      {/* Tab buttons */}
      <div className="border-b border-gray-700 p-2 flex justify-around">
        <Button
          variant="ghost"
          size="sm"
          className={activeTab === "tools" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("tools")}
        >
          <Box className="h-4 w-4 mr-1" />
          <span className="text-xs">Tools</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={activeTab === "properties" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("properties")}
        >
          <Settings className="h-4 w-4 mr-1" />
          <span className="text-xs">Properties</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={activeTab === "colors" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("colors")}
        >
          <Palette className="h-4 w-4 mr-1" />
          <span className="text-xs">Colors</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={activeTab === "layers" ? "bg-gray-800" : ""}
          onClick={() => setActiveTab("layers")}
        >
          <Layers className="h-4 w-4 mr-1" />
          <span className="text-xs">Layers</span>
        </Button>
      </div>

      {/* Tab content */}
      <div className="overflow-y-auto flex-grow p-4">
        {/* Tools Tab */}
        {activeTab === "tools" && (
          <ToolsTab
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isDarkMode={true}
          />
        )}

        {/* Properties Tab */}
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

        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm mb-4">Colors</h3>
            <ColorPickerTab
              selectedObject={selectedObject}
              onColorChange={handleColorChange}
            />
          </div>
        )}

        {/* Layers Tab */}
        {activeTab === "layers" && (
          <div>
            <h3 className="font-medium text-sm mb-4">Layers</h3>
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
      </div>

      <Button
        variant="ghost"
        className="mx-auto mb-4 bg-gray-800 text-xs py-1 px-3 rounded-md"
      >
        Documentation
      </Button>
    </div>
  );
};
