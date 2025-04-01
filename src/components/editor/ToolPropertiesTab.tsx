import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onBlendModeChange,
}) => {
  return (
    <div>
      <h3 className="font-medium text-lg">Effects</h3>

      <div className="mt-4">
        <div className="font-medium mb-3">Tool Properties</div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="brush-size" className="text-sm">
              Brush Size
            </Label>
            <span className="text-sm font-medium">{brushSize}px</span>
          </div>
          <Slider
            id="brush-size"
            min={1}
            max={100}
            step={1}
            value={[brushSize]}
            onValueChange={onBrushSizeChange}
          />
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="opacity" className="text-sm">
              Opacity
            </Label>
            <span className="text-sm font-medium">{opacity}%</span>
          </div>
          <Slider
            id="opacity"
            min={0}
            max={100}
            step={1}
            value={[opacity]}
            onValueChange={onOpacityChange}
          />
        </div>

        <div className="mb-3">
          <Label htmlFor="blend-mode" className="text-sm block mb-1">
            Blend Mode
          </Label>
          <Select value={blendMode} onValueChange={onBlendModeChange}>
            <SelectTrigger className="h-8">
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
    </div>
  );
};
