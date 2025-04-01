
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PenTool, Layers, Palette, FileText, BookOpen } from "lucide-react";

interface GlobalSidebarProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  activeTool,
  setActiveTool,
}) => {
  const tools = [
    { name: "draw", icon: PenTool, tooltip: "Draw Tools" },
    { name: "layers", icon: Layers, tooltip: "Layers" },
    { name: "colors", icon: Palette, tooltip: "Colors" },
    { name: "templates", icon: FileText, tooltip: "Templates" },
    { name: "help", icon: BookOpen, tooltip: "Help" },
  ];

  return (
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 h-full">
      <div className="flex flex-col gap-4">
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
