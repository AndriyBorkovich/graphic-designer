import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fabric } from "fabric";

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface LayersTabProps {
  layers: Layer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
  onLayerMoveUp: (layerId: string) => void;
  onLayerMoveDown: (layerId: string) => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerAdd,
  onLayerDelete,
  onLayerMoveUp,
  onLayerMoveDown,
}) => {
  const getLayerIcon = (type: Layer["type"]) => {
    switch (type) {
      case "background":
        return <div className="w-3 h-3 bg-blue-500 rounded"></div>;
      case "text":
        return <div className="w-3 h-3 text-xs font-bold">T</div>;
      case "shape":
        return <div className="w-3 h-3 border border-current rotate-45"></div>;
      case "image":
        return <div className="w-3 h-3 border border-current"></div>;
      case "adjustment":
        return (
          <div className="w-3 h-3 rounded-full border border-current"></div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          <span>Layers</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onLayerAdd}
            title="Add Layer"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-400 hover:text-red-500 hover:hover:bg-[#4318D1]/60"
            disabled={activeLayerId === null}
            onClick={() => activeLayerId && onLayerDelete(activeLayerId)}
            title="Delete Layer"
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 border rounded-md">
        <div className="p-1">
          {layers.length > 0 ? (
            layers.map((layer) => (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer text-sm hover:hover:bg-[#4318D1]",
                  activeLayerId === layer.id && "bg-[#4318D1] hover:bg-blue-100"
                )}
                onClick={() => onLayerSelect(layer.id)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerVisibilityToggle(layer.id);
                  }}
                  title={layer.visible ? "Hide Layer" : "Show Layer"}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>

                <span className="w-5 h-5 flex items-center justify-center">
                  {getLayerIcon(layer.type)}
                </span>

                <span className="flex-1 truncate">{layer.name}</span>

                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerMoveDown(layer.id);
                    }}
                    title="Move Up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerMoveUp(layer.id);
                    }}
                    title="Move Down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No layers available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
