import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { Canvas } from "./Canvas";
import { SidebarNav } from "./SidebarNav";
import { ToolsTab } from "./ToolsTab";
import { ColorPickerTab } from "./ColorPickerTab";
import { LayersTab } from "./LayersTab";
import { Undo, Redo, ZoomIn, ZoomOut, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fabric } from "fabric";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface FabricObject extends fabric.Object {
  id?: string;
  name?: string;
  type?: string;
  visible?: boolean;
}

interface EditorLayoutProps {
  activeTool?: string;
  setActiveTool: (tool: string) => void;
  projectId?: string;
  projectName?: string;
  initialCanvasData?: string | null;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  activeTool = "select",
  setActiveTool,
  projectId,
  projectName = "Untitled Project",
  initialCanvasData,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Track unsaved changes
  const markUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Warn about unsaved changes when leaving
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return (event.returnValue =
            "You have unsaved changes. Are you sure you want to leave?");
        }
      },
      [hasUnsavedChanges]
    )
  );

  // Handle zoom in function
  const handleZoomIn = () => {
    try {
      if (zoom < 200) {
        setZoom(zoom + 10);
      } else {
        toast.info("Maximum zoom reached");
      }
    } catch (error) {
      console.error("Error zooming in:", error);
      toast.error("Error while zooming in");
    }
  };

  // Handle zoom out function
  const handleZoomOut = () => {
    try {
      if (zoom > 50) {
        setZoom(zoom - 10);
      } else {
        toast.info("Minimum zoom reached");
      }
    } catch (error) {
      console.error("Error zooming out:", error);
      toast.error("Error while zooming out");
    }
  };

  // Handle canvas initialization
  const handleCanvasInitialized = (canvas: fabric.Canvas) => {
    setFabricCanvas(canvas);
  };

  // Load initial canvas data when canvas is initialized
  useEffect(() => {
    if (!fabricCanvas || !initialCanvasData) return;

    try {
      const canvasState = JSON.parse(initialCanvasData);
      fabricCanvas.loadFromJSON(canvasState, () => {
        fabricCanvas.renderAll();

        // Update layers based on loaded objects
        const loadedObjects = fabricCanvas.getObjects() as FabricObject[];
        const newLayers: Layer[] = loadedObjects.map((obj) => ({
          id: obj.id || uuidv4(),
          name: obj.name || "Imported Object",
          type: (obj.type as Layer["type"]) || "shape",
          visible: obj.visible !== false,
          object: obj,
        }));

        // Add background layer if not present
        if (!newLayers.find((layer) => layer.type === "background")) {
          newLayers.unshift({
            id: uuidv4(),
            name: "Background",
            type: "background",
            visible: true,
            object: fabricCanvas as unknown as fabric.Object,
          });
        }

        setLayers(newLayers);
        toast.success("Project loaded successfully");
      });
    } catch (error) {
      console.error("Error loading canvas state:", error);
      toast.error("Failed to load project data");
    }
  }, [fabricCanvas, initialCanvasData]);

  // Save project data to Supabase
  const handleSave = async () => {
    if (!user || !projectId) {
      toast.error("Unable to save: No active project or user session");
      return;
    }

    if (!fabricCanvas) {
      toast.error("Canvas not initialized");
      return;
    }

    try {
      setIsSaving(true);

      // Get canvas state directly from the Fabric.js instance
      const canvasState = JSON.stringify(
        fabricCanvas.toJSON(["id", "name", "type", "visible"])
      );
      const currentTime = new Date().toISOString();

      console.log("Data to update", canvasState, currentTime, currentTime);

      // Save to Supabase
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          canvas_data: canvasState,
          updated_at: currentTime,
          last_modified_by: user.id,
        })
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Update state
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      toast.success(`Project "${projectName}" saved successfully`);
    } catch (error: any) {
      console.error("Error saving project:", error);

      if (error.code === "PGRST116") {
        toast.error("You don't have permission to save this project");
      } else if (error.code === "23505") {
        toast.error("A project with this name already exists");
      } else if (error.message?.includes("network")) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("Failed to save project. Please try again");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality (optional)
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges]);

  // Object update handler
  const handleObjectUpdate = (property: string, value: any) => {
    if (!selectedObject) return;

    // Check if the selected object is the background layer
    const isBackground =
      selectedObject ===
      layers.find((layer) => layer.type === "background")?.object;

    if (isBackground && property === "fill") {
      // For background color changes, update the canvas background color
      if (selectedObject.canvas) {
        selectedObject.canvas.setBackgroundColor(value, () => {
          selectedObject.canvas.renderAll();
        });
      }
    } else {
      // For regular objects, update the property directly
      selectedObject.set({ [property]: value });
      setSelectedObject(selectedObject);

      if (selectedObject.canvas) {
        selectedObject.canvas.renderAll();
      }
    }

    markUnsavedChanges();
  };

  // Layer management functions
  const handleLayerSelect = (layerId: string) => {
    setActiveLayerId(layerId);
    const layer = layers.find((l) => l.id === layerId);
    if (layer && layer.type !== "background") {
      setSelectedObject(layer.object);
    } else {
      setSelectedObject(null);
    }
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleLayerAdd = () => {
    toast.info("Layer adding functionality to be implemented");
  };

  const handleLayerDelete = (layerId: string) => {
    const layerToDelete = layers.find((l) => l.id === layerId);

    if (!layerToDelete) return;

    // Can't delete background
    if (layerToDelete.type === "background") {
      toast.error("Cannot delete background layer");
      return;
    }

    // Remove the object from canvas
    if (layerToDelete.object.canvas) {
      layerToDelete.object.canvas.remove(layerToDelete.object);
    }

    // Remove the layer from state
    setLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.id !== layerId)
    );

    // Clear selection if the deleted layer was selected
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
      setSelectedObject(null);
    }

    toast.success("Layer deleted");

    markUnsavedChanges();
  };

  const handleLayerMoveUp = (layerId: string) => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex < layers.length - 1 && layerIndex !== -1) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex + 1];
      newLayers[layerIndex + 1] = temp;

      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== "background") {
        temp.object.bringForward();
      }

      setLayers(newLayers);
    }
  };

  const handleLayerMoveDown = (layerId: string) => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex > 0) {
      const newLayers = [...layers];
      const temp = newLayers[layerIndex];
      newLayers[layerIndex] = newLayers[layerIndex - 1];
      newLayers[layerIndex - 1] = temp;

      // Update z-index in canvas
      if (temp.object.canvas && temp.type !== "background") {
        temp.object.sendBackwards();
      }

      setLayers(newLayers);
    }
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "tools":
        return (
          <ToolsTab activeTool={activeTool} setActiveTool={setActiveTool} />
        );
      case "colors":
        return (
          <ColorPickerTab
            selectedObject={selectedObject}
            onColorChange={(property, color) =>
              handleObjectUpdate(property, color)
            }
          />
        );
      case "layers":
        return (
          <LayersTab
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerSelect={handleLayerSelect}
            onLayerVisibilityToggle={handleLayerVisibilityToggle}
            onLayerAdd={handleLayerAdd}
            onLayerDelete={handleLayerDelete}
            onLayerMoveUp={handleLayerMoveUp}
            onLayerMoveDown={handleLayerMoveDown}
          />
        );
      default:
        return null;
    }
  };

  // Navigation with unsaved changes check
  const navigateToProjects = () => {
    if (hasUnsavedChanges) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!shouldLeave) {
        return;
      }
    }
    navigate("/projects");
  };

  return (
    <div className="flex h-auto w-auto">
      <div className="flex">
        <div className="bg-gray-900 border-r border-gray-800">
          <SidebarNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onProjectsClick={navigateToProjects}
          />
        </div>
        <div className="bg-[#2A2A2A] w-64 p-4 border-r border-gray-800">
          {renderActiveTabContent()}
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full w-auto">
        <div className="flex justify-between items-center p-2 border-b bg-[#2A2A2A] text-white w-full">
          <div className="ml-2 font-medium truncate">
            {projectName}
            {hasUnsavedChanges && (
              <span className="ml-2 text-yellow-400">•</span>
            )}
            {lastSavedAt && (
              <span className="ml-2 text-sm text-gray-400">
                Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="Save Project"
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={cn(
                isSaving && "animate-pulse",
                !hasUnsavedChanges && "opacity-50"
              )}
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Undo">
              <Undo className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Redo">
              <Redo className="h-5 w-5" />
            </Button>
            <div className="flex items-center border rounded-md border-gray-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-900/20"
              onClick={() => {
                if (selectedObject && selectedObject.canvas) {
                  const canvas = selectedObject.canvas;
                  canvas.remove(selectedObject);
                  setSelectedObject(null);

                  // Remove the corresponding layer
                  const layerToRemove = layers.find(
                    (l) => l.object === selectedObject
                  );
                  if (layerToRemove) {
                    handleLayerDelete(layerToRemove.id);
                  }

                  toast.success("Object deleted");
                }
              }}
              disabled={!selectedObject}
              title="Delete selected"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-800">
          <div className="h-auto w-auto flex items-center justify-center">
            <Canvas
              activeTool={activeTool}
              zoom={zoom}
              setSelectedObject={setSelectedObject}
              layers={layers}
              setLayers={setLayers}
              activeLayerId={activeLayerId}
              setActiveLayerId={setActiveLayerId}
              onCanvasInitialized={handleCanvasInitialized}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
