
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ColorPickerTab } from "./ColorPickerTab";
import { ToolPropertiesTab } from "./ToolPropertiesTab";
import { Settings, Palette } from "lucide-react";

interface PropertiesPanelProps {
  selectedObject: any;
  onObjectUpdate?: (property: string, value: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onObjectUpdate }) => {
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

  // If no object selected, show basic message
  if (!selectedObject) {
    return (
      <div className="w-64 bg-gray-50 border-l p-4">
        <h3 className="font-medium mb-4">Properties</h3>
        <p className="text-sm text-gray-500">No object selected</p>
      </div>
    );
  }

  const objectType = selectedObject.type;
  
  return (
    <div className="w-64 bg-gray-50 border-l p-4 overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="properties" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Properties</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span>Colors</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          {/* Position */}
          <div>
            <h4 className="text-sm font-medium mb-2">Position</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pos-x" className="text-xs">X</Label>
                <Input 
                  id="pos-x" 
                  type="number" 
                  value={Math.round(selectedObject.left)} 
                  className="h-8"
                  onChange={(e) => onObjectUpdate && onObjectUpdate("left", parseFloat(e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs">Y</Label>
                <Input 
                  id="pos-y" 
                  type="number" 
                  value={Math.round(selectedObject.top)} 
                  className="h-8"
                  onChange={(e) => onObjectUpdate && onObjectUpdate("top", parseFloat(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          {/* Size */}
          <div>
            <h4 className="text-sm font-medium mb-2">Size</h4>
            <div className="grid grid-cols-2 gap-2">
              {objectType === "circle" ? (
                <div className="col-span-2">
                  <Label htmlFor="radius" className="text-xs">Radius</Label>
                  <Input 
                    id="radius" 
                    type="number" 
                    value={Math.round(selectedObject.radius)} 
                    className="h-8"
                    onChange={(e) => onObjectUpdate && onObjectUpdate("radius", parseFloat(e.target.value))} 
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="width" className="text-xs">Width</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      value={Math.round(selectedObject.width || 0)} 
                      className="h-8"
                      onChange={(e) => onObjectUpdate && onObjectUpdate("width", parseFloat(e.target.value))} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      value={Math.round(selectedObject.height || 0)} 
                      className="h-8"
                      onChange={(e) => onObjectUpdate && onObjectUpdate("height", parseFloat(e.target.value))} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Rotation */}
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="rotation" className="text-xs">Rotation</Label>
              <span className="text-xs">{Math.round(selectedObject.angle || 0)}°</span>
            </div>
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[selectedObject.angle || 0]}
              onValueChange={(value) => onObjectUpdate && onObjectUpdate("angle", value[0])}
              className="my-1"
            />
          </div>
          
          {/* Text specific properties */}
          {objectType === "textbox" && (
            <div>
              <h4 className="text-sm font-medium mb-2">Text</h4>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="text-content" className="text-xs">Content</Label>
                  <Input 
                    id="text-content" 
                    value={selectedObject.text} 
                    className="h-8"
                    onChange={(e) => onObjectUpdate && onObjectUpdate("text", e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="font-size" className="text-xs flex justify-between">
                    <span>Font Size</span>
                    <span>{selectedObject.fontSize || 16}px</span>
                  </Label>
                  <Slider 
                    id="font-size" 
                    min={8} 
                    max={72} 
                    step={1}
                    value={[selectedObject.fontSize || 16]} 
                    onValueChange={(value) => onObjectUpdate && onObjectUpdate("fontSize", value[0])}
                    className="my-1" 
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <ColorPickerTab selectedObject={selectedObject} onColorChange={handleColorChange} />
          <div className="border-t border-gray-200 my-4 pt-4">
            <ToolPropertiesTab 
              brushSize={brushSize}
              opacity={opacity}
              blendMode={blendMode}
              onBrushSizeChange={handleBrushSizeChange}
              onOpacityChange={handleOpacityChange}
              onBlendModeChange={handleBlendModeChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
