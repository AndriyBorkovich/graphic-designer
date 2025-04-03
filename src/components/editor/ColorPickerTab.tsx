import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Palette, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ColorPickerTabProps {
  selectedObject: any;
  onColorChange?: (property: string, color: string) => void;
}

export const ColorPickerTab: React.FC<ColorPickerTabProps> = ({
  selectedObject,
  onColorChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>("picker");
  const [currentColor, setCurrentColor] = useState<string>("#00FF00");
  const [colorTarget, setColorTarget] = useState<string>("fill");

  // RGB values
  const [red, setRed] = useState<number>(0);
  const [green, setGreen] = useState<number>(255);
  const [blue, setBlue] = useState<number>(0);

  // Recent colors array
  const [recentColors, setRecentColors] = useState<string[]>([
    "#5500ff",
    "#ff5500",
    "#00ff55",
    "#4400ff",
    "#ffff00",
  ]);

  // Initialize color values based on selected object
  useEffect(() => {
    if (selectedObject) {
      // Check if the selected object is the background
      const isBackground =
        selectedObject.canvas && selectedObject === selectedObject.canvas;

      let targetColor = "#000000";

      if (isBackground) {
        // For background, get the canvas background color
        targetColor = selectedObject.backgroundColor || "#ffffff";
      } else {
        // For regular objects, get fill or stroke color
        targetColor =
          colorTarget === "fill"
            ? selectedObject.fill || "#000000"
            : selectedObject.stroke || "#000000";
      }

      setCurrentColor(targetColor);

      // Parse the hex color to RGB
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        targetColor
      );
      if (result) {
        setRed(parseInt(result[1], 16));
        setGreen(parseInt(result[2], 16));
        setBlue(parseInt(result[3], 16));
      }
    }
  }, [selectedObject, colorTarget]);

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Handle direct hex input change
  const handleHexChange = (value: string) => {
    setCurrentColor(value);

    // Parse the hex color to update RGB sliders
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    if (result) {
      setRed(parseInt(result[1], 16));
      setGreen(parseInt(result[2], 16));
      setBlue(parseInt(result[3], 16));
    }

    if (onColorChange) {
      onColorChange(colorTarget, value);
    }
  };

  // Handle RGB slider changes
  const handleRedChange = (value: number[]) => {
    const newRed = value[0];
    setRed(newRed);
    const newHex = rgbToHex(newRed, green, blue);
    setCurrentColor(newHex);

    if (onColorChange) {
      onColorChange(colorTarget, newHex);
    }
  };

  const handleGreenChange = (value: number[]) => {
    const newGreen = value[0];
    setGreen(newGreen);
    const newHex = rgbToHex(red, newGreen, blue);
    setCurrentColor(newHex);

    if (onColorChange) {
      onColorChange(colorTarget, newHex);
    }
  };

  const handleBlueChange = (value: number[]) => {
    const newBlue = value[0];
    setBlue(newBlue);
    const newHex = rgbToHex(red, green, newBlue);
    setCurrentColor(newHex);

    if (onColorChange) {
      onColorChange(colorTarget, newHex);
    }
  };

  // Handle color picker change
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);

    // Parse the hex color to update RGB sliders
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newColor);
    if (result) {
      setRed(parseInt(result[1], 16));
      setGreen(parseInt(result[2], 16));
      setBlue(parseInt(result[3], 16));
    }

    if (onColorChange) {
      onColorChange(colorTarget, newColor);
    }
  };

  // Add color to recent colors
  const addToRecentColors = (color: string) => {
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors.slice(0, 4)];
      setRecentColors(newRecentColors);
    }
  };

  // Handle selecting a recent color
  const selectRecentColor = (color: string) => {
    setCurrentColor(color);

    // Parse the hex color to update RGB sliders
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      setRed(parseInt(result[1], 16));
      setGreen(parseInt(result[2], 16));
      setBlue(parseInt(result[3], 16));
    }

    if (onColorChange) {
      onColorChange(colorTarget, color);
    }
  };

  // Handle switching between fill and stroke
  const handleColorTargetChange = (target: string) => {
    setColorTarget(target);
  };

  // Check if the selected object is the background
  const isBackground =
    selectedObject &&
    selectedObject.canvas &&
    selectedObject === selectedObject.canvas;

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2 text-white">Color Selection</h3>

      {/* Color target selection */}
      <div className="flex mb-3">
        {isBackground ? (
          <div className="flex-1 px-2 py-1 text-center text-sm cursor-pointer transition-colors bg-primary text-white">
            Background
          </div>
        ) : (
          <>
            <div
              className={`flex-1 px-2 py-1 text-center text-sm rounded-sm cursor-pointer transition-colors ${
                colorTarget === "fill"
                  ? "bg-[#4318D1] text-white"
                  : "bg-[#3A3A3A] text-gray-300"
              }`}
              onClick={() => handleColorTargetChange("fill")}
            >
              Fill
            </div>
            <div
              className={`flex-1 px-2 py-1 text-center text-sm  rounded-sm cursor-pointer transition-colors ${
                colorTarget === "stroke"
                  ? "bg-[#4318D1] text-white"
                  : "bg-[#3A3A3A] text-gray-300"
              }`}
              onClick={() => handleColorTargetChange("stroke")}
            >
              Stroke
            </div>
          </>
        )}
      </div>

      {/* Color tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              value={currentColor}
              onChange={handleColorPickerChange}
              onBlur={() => addToRecentColors(currentColor)}
              className="absolute inset-0 w-full h-full opacity-100 cursor-pointer"
            />
          </div>
        </TabsContent>

        {/* RGB Sliders */}
        <TabsContent value="sliders" className="pt-4">
          <div className="w-full aspect-square max-h-48 bg-gray-800 mb-3 rounded flex items-center justify-center">
            <div
              style={{ backgroundColor: currentColor }}
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
          Hex Color
        </Label>
        <Input
          id="hex-color"
          value={currentColor}
          disabled={true}
          onChange={(e) => {
            const value = e.target.value;
            // Allow empty input or # prefix
            if (value === "" || value === "#") {
              handleHexChange(value);
              return;
            }
            // Validate hex color format
            const hexRegex = /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
            if (hexRegex.test(value)) {
              // Add # prefix if missing
              const normalizedValue = value.startsWith("#")
                ? value
                : `#${value}`;
              handleHexChange(normalizedValue);
            }
          }}
          onBlur={() => {
            // Ensure color is valid before adding to recent colors
            const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
            if (hexRegex.test(currentColor)) {
              addToRecentColors(currentColor);
            }
          }}
          placeholder="#000000"
          className="h-8"
        />
      </div>

      {/* Recent colors */}
      <div>
        <Label className="text-xs block mb-2 text-white">Recent Colors</Label>
        <div className="flex space-x-2">
          {recentColors.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="w-6 h-6 rounded cursor-pointer border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => selectRecentColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
