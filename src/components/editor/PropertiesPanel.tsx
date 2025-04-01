
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PropertiesPanelProps {
  selectedObject: any;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject }) => {
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
      <h3 className="font-medium mb-4">Properties</h3>
      
      <div className="space-y-4">
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
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs">Y</Label>
              <Input 
                id="pos-y" 
                type="number" 
                value={Math.round(selectedObject.top)} 
                className="h-8" 
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
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    value={Math.round(selectedObject.height || 0)} 
                    className="h-8" 
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Appearance */}
        <div>
          <h4 className="text-sm font-medium mb-2">Appearance</h4>
          <div className="space-y-2">
            <div>
              <Label htmlFor="fill-color" className="text-xs">Fill Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 border rounded" 
                  style={{ backgroundColor: selectedObject.fill || 'transparent' }} 
                />
                <Input 
                  id="fill-color" 
                  type="text" 
                  value={selectedObject.fill || 'transparent'} 
                  className="h-8" 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="stroke-color" className="text-xs">Stroke Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 border rounded" 
                  style={{ backgroundColor: selectedObject.stroke || 'black' }} 
                />
                <Input 
                  id="stroke-color" 
                  type="text" 
                  value={selectedObject.stroke || 'black'} 
                  className="h-8" 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="stroke-width" className="text-xs flex justify-between">
                <span>Stroke Width</span>
                <span>{selectedObject.strokeWidth || 0}</span>
              </Label>
              <Slider 
                id="stroke-width" 
                min={0} 
                max={20} 
                step={1}
                defaultValue={[selectedObject.strokeWidth || 0]} 
                className="my-1" 
              />
            </div>
          </div>
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
                  defaultValue={[selectedObject.fontSize || 16]} 
                  className="my-1" 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
