import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ColorPickerTab } from "./ColorPickerTab";
import { ToolPropertiesTab } from "./ToolPropertiesTab";
import { LayersTab } from "./LayersTab";
import { Toolbox } from "./Toolbox";
import {
  Settings,
  Palette,
  Layers,
  PenTool,
  SlidersHorizontal,
} from "lucide-react";

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
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
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
  const [activeTab, setActiveTab] = useState<string>("properties");
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
    <div className="flex h-full">
      <Toolbox activeTool={activeTab} setActiveTool={setActiveTab} />

      {/* Layers Tab */}
      {activeTab === "layers" && (
        <div className="h-[calc(100vh-4rem)]">
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

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg mb-4">Colors</h3>
          <ColorPickerTab
            selectedObject={selectedObject}
            onColorChange={handleColorChange}
          />
        </div>
      )}

      {/* tool properties tab */}
      {activeTab === "properties" && (
        <div className="p-4 w-56 bg-gray-100">
          <ToolPropertiesTab
            brushSize={brushSize}
            opacity={opacity}
            blendMode={blendMode}
            onBrushSizeChange={handleBrushSizeChange}
            onOpacityChange={handleOpacityChange}
            onBlendModeChange={handleBlendModeChange}
          />
        </div>
      )}
    </div>
  );
};
