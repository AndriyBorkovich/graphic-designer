
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
                    ? "bg-indigo-600"
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
    </div>
  );
};
