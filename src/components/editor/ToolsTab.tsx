
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MousePointer,
  PenTool,
  Square,
  Circle,
  Type,
  Eraser,
  Palette,
  Sliders,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolsTabProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  isDarkMode?: boolean;
  brushColor?: string;
  brushWidth?: number;
  onBrushWidthChange?: (width: number) => void;
  onBrushColorChange?: (color: string) => void;
  onTextPropertyChange?: (property: string, value: any) => void;
  textProperties?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: "" | "normal" | "italic" | "oblique";
    underline?: boolean;
    textAlign?: string;
  };
  eraserWidth?: number;
  onEraserWidthChange?: (width: number) => void;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  activeTool,
  setActiveTool,
  isDarkMode = true,
  brushColor = "#000000",
  brushWidth = 5,
  onBrushWidthChange,
  onBrushColorChange,
  onTextPropertyChange,
  textProperties = {
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
  },
  eraserWidth = 20,
  onEraserWidthChange,
}) => {
  const [activeColorTab, setActiveColorTab] = useState<string>("picker");
  const [red, setRed] = useState<number>(0);
  const [green, setGreen] = useState<number>(0);
  const [blue, setBlue] = useState<number>(0);
  const [recentColors, setRecentColors] = useState<string[]>([
    "#5500ff",
    "#ff5500",
    "#00ff55",
    "#4400ff",
    "#ffff00",
  ]);

  const tools = [
    { name: "select", icon: MousePointer, tooltip: "Select" },
    { name: "draw", icon: PenTool, tooltip: "Draw" },
    { name: "rectangle", icon: Square, tooltip: "Rectangle" },
    { name: "circle", icon: Circle, tooltip: "Circle" },
    { name: "text", icon: Type, tooltip: "Text" },
    { name: "eraser", icon: Eraser, tooltip: "Eraser" },
  ];

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Courier New",
    "Georgia",
    "Verdana",
    "Impact",
  ];

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Handle RGB slider changes
  const handleRedChange = (value: number[]) => {
    const newRed = value[0];
    setRed(newRed);
    const newHex = rgbToHex(newRed, green, blue);
    onBrushColorChange?.(newHex);
  };

  const handleGreenChange = (value: number[]) => {
    const newGreen = value[0];
    setGreen(newGreen);
    const newHex = rgbToHex(red, newGreen, blue);
    onBrushColorChange?.(newHex);
  };

  const handleBlueChange = (value: number[]) => {
    const newBlue = value[0];
    setBlue(newBlue);
    const newHex = rgbToHex(red, green, newBlue);
    onBrushColorChange?.(newHex);
  };

  // Add color to recent colors
  const addToRecentColors = (color: string) => {
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors.slice(0, 4)];
      setRecentColors(newRecentColors);
    }
  };

  return (
    <div>
      <h3 className="font-medium text-lg mb-4 text-white">Tools</h3>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-14 h-14 rounded-md ${
                  activeTool === tool.name
                    ? "bg-[#4318D1] hover:bg-gray-900"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTool(tool.name)}
              >
                <tool.icon className="w-6 h-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Pen Width Control */}
      {activeTool === "draw" && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium mb-2 text-white">Brush width</h4>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="brush-width" className="text-xs text-white">
                Width
              </Label>
              <span className="text-xs text-white">{brushWidth}px</span>
            </div>
            <Slider
              id="brush-width"
              min={1}
              max={50}
              step={1}
              value={[brushWidth]}
              onValueChange={(value) => onBrushWidthChange?.(value[0])}
              className="my-2"
            />
          </div>
        </div>
      )}

      {/* Eraser Width Control */}
      {activeTool === "eraser" && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium mb-2 text-white">Eraser width</h4>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="eraser-width" className="text-xs text-white">
                Width
              </Label>
              <span className="text-xs text-white">{eraserWidth}px</span>
            </div>
            <Slider
              id="eraser-width"
              min={1}
              max={100}
              step={1}
              value={[eraserWidth]}
              onValueChange={(value) => onEraserWidthChange?.(value[0])}
              className="my-2"
            />
          </div>
        </div>
      )}

      {/* Text Properties */}
      {activeTool === "text" && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium mb-2 text-white">
            Text properties
          </h4>

          {/* Font Family */}
          <div>
            <Label htmlFor="font-family" className="text-xs text-white mb-2">
              Font family
            </Label>
            <Select
              value={textProperties.fontFamily}
              onValueChange={(value) =>
                onTextPropertyChange?.("fontFamily", value)
              }
            >
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-xs text-white">
                Font size
              </Label>
              <span className="text-xs text-white">
                {textProperties.fontSize}px
              </span>
            </div>
            <Slider
              id="font-size"
              min={8}
              max={72}
              step={1}
              value={[textProperties.fontSize || 18]}
              onValueChange={(value) =>
                onTextPropertyChange?.("fontSize", value[0])
              }
              className="my-2"
            />
          </div>

          {/* Text Style Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 ${
                textProperties.fontWeight === "bold"
                  ? "bg-[#4318D1]"
                  : "bg-gray-800"
              }`}
              onClick={() =>
                onTextPropertyChange?.(
                  "fontWeight",
                  textProperties.fontWeight === "bold" ? "normal" : "bold"
                )
              }
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 ${
                textProperties.fontStyle === "italic"
                  ? "bg-[#4318D1]"
                  : "bg-gray-800"
              }`}
              onClick={() =>
                onTextPropertyChange?.(
                  "fontStyle",
                  textProperties.fontStyle === "italic" ? "normal" : "italic"
                )
              }
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 ${
                textProperties.underline ? "bg-[#4318D1]" : "bg-gray-800"
              }`}
              onClick={() =>
                onTextPropertyChange?.("underline", !textProperties.underline)
              }
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 text-white h-10 ${
                textProperties.textAlign === "left"
                  ? "bg-[#4318D1]"
                  : "bg-gray-800"
              }`}
              onClick={() => onTextPropertyChange?.("textAlign", "left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 text-white h-10 ${
                textProperties.textAlign === "center"
                  ? "bg-[#4318D1]"
                  : "bg-[#333333]"
              }`}
              onClick={() => onTextPropertyChange?.("textAlign", "center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 text-white h-10 ${
                textProperties.textAlign === "right"
                  ? "bg-[#4318D1]"
                  : "bg-[#333333]"
              }`}
              onClick={() => onTextPropertyChange?.("textAlign", "right")}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Brush color picker */}
      {activeTool === "draw" && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium mb-2 text-white">Brush color</h4>

          <Tabs
            value={activeColorTab}
            onValueChange={setActiveColorTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-[#3A3A3A]">
              <TabsTrigger value="picker" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span>Picker</span>
              </TabsTrigger>
              <TabsTrigger value="sliders" className="flex items-center gap-1">
                <Sliders className="h-4 w-4" />
                <span>Sliders</span>
              </TabsTrigger>
            </TabsList>

            {/* Color Picker */}
            <TabsContent value="picker" className="pt-4">
              <div className="relative w-full aspect-square max-h-48 bg-gray-800 rounded overflow-hidden">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => {
                    onBrushColorChange?.(e.target.value);
                    addToRecentColors(e.target.value);
                  }}
                  className="absolute inset-0 w-full h-full opacity-100 cursor-pointer"
                />
              </div>
            </TabsContent>

            {/* RGB Sliders */}
            <TabsContent value="sliders" className="pt-4">
              <div className="w-full aspect-square max-h-48 bg-gray-800 mb-3 rounded flex items-center justify-center">
                <div
                  style={{ backgroundColor: brushColor }}
                  className="w-5/6 h-5/6 rounded-sm"
                />
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="red" className="text-xs text-white">
                      Red
                    </Label>
                    <span className="text-xs text-white">
                      {Math.round((red / 255) * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="red"
                    min={0}
                    max={255}
                    step={1}
                    value={[red]}
                    onValueChange={handleRedChange}
                    className="my-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-none [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&_[role=slider]]:shadow-black/50 [&_[role=slider]]:hover:bg-white/90 [&_[role=slider]]:focus:bg-white/90 [&_[role=track]]:h-1 [&_[role=track]]:bg-red-500/30 [&_[role=range]]:bg-red-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="green" className="text-xs text-white">
                      Green
                    </Label>
                    <span className="text-xs text-white">
                      {Math.round((green / 255) * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="green"
                    min={0}
                    max={255}
                    step={1}
                    value={[green]}
                    onValueChange={handleGreenChange}
                    className="my-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-none [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&_[role=slider]]:shadow-black/50 [&_[role=slider]]:hover:bg-white/90 [&_[role=slider]]:focus:bg-white/90 [&_[role=track]]:h-1 [&_[role=track]]:bg-green-500/30 [&_[role=range]]:bg-green-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="blue" className="text-xs text-white">
                      Blue
                    </Label>
                    <span className="text-xs text-white">
                      {Math.round((blue / 255) * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="blue"
                    min={0}
                    max={255}
                    step={1}
                    value={[blue]}
                    onValueChange={handleBlueChange}
                    className="my-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-none [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&_[role=slider]]:shadow-black/50 [&_[role=slider]]:hover:bg-white/90 [&_[role=slider]]:focus:bg-white/90 [&_[role=track]]:h-1 [&_[role=track]]:bg-blue-500/30 [&_[role=range]]:bg-blue-500"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Hex input */}
          <div>
            <Label htmlFor="hex-color" className="text-xs text-white">
              Hex color
            </Label>
            <Input
              id="hex-color"
              value={brushColor}
              disabled={true}
              className="h-8"
            />
          </div>

          {/* Recent colors */}
          <div>
            <Label className="text-xs block mb-2 text-white">
              Recent colors
            </Label>
            <div className="flex space-x-2">
              {recentColors.map((color, index) => (
                <div
                  key={`${color}-${index}`}
                  className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => onBrushColorChange?.(color)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
