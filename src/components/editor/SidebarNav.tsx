import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ClubIcon,
  PaletteIcon,
  Layers,
  LayoutGrid,
  BookIcon,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarNavProps {
  activeTab: string;
  hideGeneralTabs?: boolean;
  setActiveTab: (tab: string) => void;
  onProjectsClick?: () => void;
  onDocumentationClick?: () => void;
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  hideGeneralTabs = false,
  setActiveTab,
  onProjectsClick,
  onDocumentationClick,
  className,
}) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "tools", icon: Pencil, label: "Tools" },
    { id: "colors", icon: PaletteIcon, label: "Colors" },
    { id: "layers", icon: Layers, label: "Layers" },
    {
      id: "projects",
      icon: LayoutGrid,
      label: "Projects",
      action: onProjectsClick || (() => navigate("/projects")),
    },
    {
      id: "documentation",
      icon: BookIcon,
      label: "Documentation",
      action: onDocumentationClick || (() => navigate("/documentation")),
    },
  ];

  return (
    <div className="bg-[#2A2A2A] h-full flex flex-col">
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col items-center gap-2">
          {tabs
            .filter((_, index) => !hideGeneralTabs || index >= 3)
            .map((tab) => (
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
                    onClick={() =>
                      tab.action ? tab.action() : setActiveTab(tab.id)
                    }
                  >
                    <tab.icon className="w-6 h-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
