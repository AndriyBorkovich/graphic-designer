import React from "react";
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
  Image,
  Eraser,
  Trash2,
} from "lucide-react";

interface ToolboxProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

type Tool = {
  name: string;
  icon: React.ElementType;
  tooltip: string;
};

export const Toolbox: React.FC<ToolboxProps> = ({
  activeTool,
  setActiveTool,
}) => {
  const tools: Tool[] = [
    { name: "select", icon: MousePointer, tooltip: "Select" },
    { name: "draw", icon: PenTool, tooltip: "Draw" },
    { name: "rectangle", icon: Square, tooltip: "Rectangle" },
    { name: "circle", icon: Circle, tooltip: "Circle" },
    { name: "text", icon: Type, tooltip: "Text" },
    { name: "image", icon: Image, tooltip: "Image" },
    { name: "eraser", icon: Eraser, tooltip: "Eraser" },
  ];

  return (
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4">
      <div className="text-xs font-bold mb-4">Tools</div>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded ${
                  activeTool === tool.name
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => setActiveTool(tool.name)}
              >
                <tool.icon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
