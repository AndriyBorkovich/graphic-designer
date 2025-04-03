
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClubIcon, PaletteIcon, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "tools", icon: ClubIcon, label: "Tools" },
    { id: "colors", icon: PaletteIcon, label: "Colors" },
    { id: "layers", icon: Layers, label: "Layers" },
    { 
      id: "projects", 
      icon: Layers, // Re-using Layers icon as a placeholder for projects
      label: "Projects",
      action: () => navigate('/projects')
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2 bg-[#2A2A2A] p-2 h-full">
      {tabs.map((tab) => (
        <Tooltip key={tab.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                activeTab === tab.id
                  ? "bg-[#4318D1] text-white hover:bg-[#4318D1]/60"
                  : "text-gray-400 hover:text-white hover:bg-[#4318D1]/60"
              }`}
              onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
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
