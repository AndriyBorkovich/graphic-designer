
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ToolPropertiesTabProps {
  brushSize: number;
  opacity: number;
  blendMode: string;
  onBrushSizeChange: (value: number[]) => void;
  onOpacityChange: (value: number[]) => void;
  onBlendModeChange: (value: string) => void;
}

export const ToolPropertiesTab: React.FC<ToolPropertiesTabProps> = ({
  brushSize,
  opacity,
  blendMode,
  onBrushSizeChange,
  onOpacityChange,
  onBlendModeChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Tool Properties</h3>
      
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="brush-size" className="text-xs">Brush Size</Label>
          <span className="text-xs">{brushSize}px</span>
        </div>
        <Slider
          id="brush-size"
          min={1}
          max={100}
          step={1}
          value={[brushSize]}
          onValueChange={onBrushSizeChange}
          className="my-1"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="opacity" className="text-xs">Opacity</Label>
          <span className="text-xs">{opacity}%</span>
        </div>
        <Slider
          id="opacity"
          min={0}
          max={100}
          step={1}
          value={[opacity]}
          onValueChange={onOpacityChange}
          className="my-1"
        />
      </div>
      
      <div>
        <Label htmlFor="blend-mode" className="text-xs block mb-1">Blend Mode</Label>
        <Select value={blendMode} onValueChange={onBlendModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a blend mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="multiply">Multiply</SelectItem>
            <SelectItem value="screen">Screen</SelectItem>
            <SelectItem value="overlay">Overlay</SelectItem>
            <SelectItem value="darken">Darken</SelectItem>
            <SelectItem value="lighten">Lighten</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
