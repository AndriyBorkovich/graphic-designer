
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CubeIcon, PaletteIcon, Layers } from "lucide-react";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "tools", icon: CubeIcon, label: "Tools" },
    { id: "colors", icon: PaletteIcon, label: "Colors" },
    { id: "layers", icon: Layers, label: "Layers" },
  ];

  return (
    <div className="flex flex-col items-center gap-2 bg-gray-900 p-2 h-full">
      {tabs.map((tab) => (
        <Tooltip key={tab.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                activeTab === tab.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/60"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{tab.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
