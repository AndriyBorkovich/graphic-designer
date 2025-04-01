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
  Eraser,
} from "lucide-react";

interface ToolsTabProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  isDarkMode?: boolean;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  activeTool,
  setActiveTool,
  isDarkMode = true,
}) => {
  const tools = [
    { name: "select", icon: MousePointer, tooltip: "Select" },
    { name: "draw", icon: PenTool, tooltip: "Draw" },
    { name: "rectangle", icon: Square, tooltip: "Rectangle" },
    { name: "circle", icon: Circle, tooltip: "Circle" },
    { name: "text", icon: Type, tooltip: "Text" },
    { name: "eraser", icon: Eraser, tooltip: "Eraser" },
  ];

  const getButtonStyles = (toolName: string) => {
    if (isDarkMode) {
      return `w-10 h-10 rounded ${
        activeTool === toolName
          ? "bg-indigo-600"
          : "bg-gray-800 hover:bg-gray-700"
      }`;
    } else {
      return `w-10 h-10 rounded ${
        activeTool === toolName ? "bg-blue-600 text-white" : "bg-gray-200"
      }`;
    }
  };

  return (
    <div>
      <h3
        className={`font-medium ${
          isDarkMode ? "text-sm text-white" : "text-lg"
        } mb-4`}
      >
        Tools
      </h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={getButtonStyles(tool.name)}
                onClick={() => setActiveTool(tool.name)}
              >
                <tool.icon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Button
        variant={isDarkMode ? "ghost" : "outline"}
        className={
          isDarkMode
            ? "mt-4 w-full bg-gray-800 hover:bg-gray-700"
            : "mt-4 w-full"
        }
      >
        Add
      </Button>
    </div>
  );
};
