import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Initialize fabric with eraser support
import "fabric/src/mixins/eraser_brush.mixin";

// Extend fabric types to include EraserBrush
declare module "fabric" {
  namespace fabric {
    class EraserBrush extends BaseBrush {
      constructor(canvas: fabric.Canvas);
      width: number;
    }

    interface Object {
      erasable?: boolean;
    }
  }
}

interface Layer {
  id: string;
  name: string;
  type: "background" | "shape" | "text" | "image" | "adjustment";
  visible: boolean;
  object: fabric.Object;
}

interface CanvasProps {
  activeTool: string;
  zoom: number;
  setSelectedObject: (object: any) => void;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  layers: Layer[];
  activeLayerId: string | null;
  setActiveLayerId: (layerId: string | null) => void;
  onCanvasInitialized?: (canvas: fabric.Canvas) => void;
}

// Default canvas dimensions
const DEFAULT_WIDTH = 1302;
const DEFAULT_HEIGHT = 800;

export const Canvas: React.FC<CanvasProps> = ({
  activeTool,
  zoom,
  setSelectedObject,
  setLayers,
  layers,
  activeLayerId,
  setActiveLayerId,
  onCanvasInitialized,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  // Initialize canvas and handle resize
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    // Clean up any existing canvas instance
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }

    try {
      // Initialize with fixed dimensions first
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      // Store canvas reference in both state and ref
      fabricCanvasRef.current = newCanvas;
      setCanvas(newCanvas);

      // Notify parent component about canvas initialization
      if (onCanvasInitialized) {
        onCanvasInitialized(newCanvas);
      }

      // Then adjust to container size
      const adjustCanvasSize = () => {
        if (!canvasContainerRef.current || !newCanvas) return;

        try {
          // Get the container dimensions
          const containerWidth = canvasContainerRef.current.clientWidth;
          const containerHeight = canvasContainerRef.current.clientHeight;

          // Apply zoom level
          const zoomRatio = zoom / 100;

          // Set the canvas dimensions to match container
          newCanvas.setDimensions(
            {
              width: containerWidth,
              height: containerHeight,
            },
            { cssOnly: false }
          );

          // Set zoom
          newCanvas.setZoom(zoomRatio);

          // Update state
          setDimensions({
            width: containerWidth,
            height: containerHeight,
          });

          // Center objects if any exist
          if (newCanvas.getObjects().length > 0) {
            newCanvas.centerObject(newCanvas.getObjects()[0]);
          }

          // Render
          newCanvas.requestRenderAll();
        } catch (error) {
          console.error("Error adjusting canvas size:", error);
        }
      };

      // Adjust size initially and on resize
      adjustCanvasSize();
      window.addEventListener("resize", adjustCanvasSize);

      // Set up event handlers
      if (newCanvas) {
        // Selection event
        newCanvas.on("selection:created", (e) => {
          setSelectedObject(e.selected ? e.selected[0] : null);

          // Find the layer that corresponds to the selected object
          if (e.selected && e.selected[0]) {
            const selectedObject = e.selected[0];
            const layer = layers.find(
              (layer) => layer.object === selectedObject
            );
            if (layer) {
              setActiveLayerId(layer.id);
            }
          }
        });

        newCanvas.on("selection:updated", (e) => {
          setSelectedObject(e.selected ? e.selected[0] : null);

          // Find the layer that corresponds to the selected object
          if (e.selected && e.selected[0]) {
            const selectedObject = e.selected[0];
            const layer = layers.find(
              (layer) => layer.object === selectedObject
            );
            if (layer) {
              setActiveLayerId(layer.id);
            }
          }
        });

        newCanvas.on("selection:cleared", () => {
          setSelectedObject(null);
          setActiveLayerId(null);
        });

        // Object modified event
        newCanvas.on("object:modified", (e) => {
          if (e.target) {
            setSelectedObject(e.target);
          }
        });

        // Object added event
        newCanvas.on("object:added", (e) => {
          if (!e.target) return;

          // Check if this is a programmatic addition from loading layers
          if ((e.target as any)._skipLayerCreation) {
            delete (e.target as any)._skipLayerCreation;
            return;
          }

          const newObject = e.target;

          // Create a new layer for the object
          const layerId = uuidv4();
          let layerType: Layer["type"] = "shape";
          let layerName = "New Shape";

          if (newObject instanceof fabric.Rect) {
            layerType = "shape";
            layerName = "Rectangle";
          } else if (newObject instanceof fabric.Circle) {
            layerType = "shape";
            layerName = "Circle";
          } else if (newObject instanceof fabric.Textbox) {
            layerType = "text";
            layerName = "Text";
          } else if (newObject instanceof fabric.Image) {
            layerType = "image";
            layerName = "Image";
          } else if (newObject instanceof fabric.Path) {
            layerType = "shape";
            layerName = "Path";
          }

          const newLayer = {
            id: layerId,
            name: layerName,
            type: layerType,
            visible: true,
            object: newObject,
          } as Layer;

          setLayers((prevLayers: Layer[]) => [...prevLayers, newLayer]);
          setActiveLayerId(layerId);
        });
      }

      // Add background layer
      const backgroundLayer = {
        id: uuidv4(),
        name: "Background",
        type: "background" as const,
        visible: true,
        object: newCanvas as unknown as fabric.Object,
      } as Layer;

      setLayers([backgroundLayer]);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", adjustCanvasSize);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, []); // Empty dependency array to initialize only once

  // Effect for zoom changes
  useEffect(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas || !canvasContainerRef.current) return;

    try {
      const containerWidth = canvasContainerRef.current.clientWidth;
      const containerHeight = canvasContainerRef.current.clientHeight;
      const zoomRatio = zoom / 100;

      currentCanvas.setDimensions({
        width: containerWidth,
        height: containerHeight,
      });
      currentCanvas.setZoom(zoomRatio);
      currentCanvas.requestRenderAll();
    } catch (error) {
      console.error("Error updating canvas zoom:", error);
    }
  }, [zoom]);

  // Effect for layers changing
  useEffect(() => {
    if (!canvas) return;

    // Update visibility of objects based on layer visibility
    layers.forEach((layer) => {
      if (layer.type !== "background" && layer.object) {
        layer.object.visible = layer.visible;
      }
    });

    canvas.renderAll();
  }, [layers, canvas]);

  // Effect for active layer changing
  useEffect(() => {
    if (!canvas || !activeLayerId) return;

    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (activeLayer && activeLayer.type !== "background") {
      canvas.setActiveObject(activeLayer.object);
      canvas.renderAll();
    }
  }, [activeLayerId, layers, canvas]);

  // Save state after modifications
  const handleStateChange = (canvas: fabric.Canvas) => {
    // Notify parent component about state change
    if (onCanvasInitialized) {
      onCanvasInitialized(canvas);
    }
  };

  // Handle tool changes
  useEffect(() => {
    if (!canvas) return;

    // Disable drawing mode by default
    canvas.isDrawingMode = false;

    // Configure based on active tool
    switch (activeTool) {
      case "select":
        canvas.selection = true;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;

      case "draw":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 5;
        canvas.freeDrawingBrush.color = "#000000";
        break;

      case "rectangle":
        canvas.on("mouse:down", startAddingRect);
        canvas.on("mouse:move", addingRect);
        canvas.on("mouse:up", stopAddingShape);
        break;

      case "circle":
        canvas.on("mouse:down", startAddingCircle);
        canvas.on("mouse:move", addingCircle);
        canvas.on("mouse:up", stopAddingShape);
        break;

      case "text":
        canvas.on("mouse:down", addText);
        break;

      case "eraser":
        canvas.isDrawingMode = true;
        try {
          // Create eraser brush
          const eraserBrush = new fabric.EraserBrush(canvas);
          eraserBrush.width = 20;
          canvas.freeDrawingBrush = eraserBrush;

          // Make all objects erasable
          canvas.getObjects().forEach((obj) => {
            if (obj.erasable === undefined) {
              obj.erasable = true;
            }
          });
        } catch (error) {
          console.error("Error initializing eraser:", error);
          toast.error("Could not initialize eraser tool");
          canvas.isDrawingMode = false;
        }
        break;

      default:
        canvas.isDrawingMode = false;
        break;
    }

    // Set up erasing events
    canvas.on("erasing:end", (event: any) => {
      if (!event.targets) return;

      console.log("Erased objects:", event.targets);
      // Update layers if needed
      setLayers((prevLayers) => {
        return prevLayers.map((layer) => {
          if (event.targets.includes(layer.object)) {
            // Mark the layer as modified
            return { ...layer };
          }
          return layer;
        });
      });

      // Save canvas state after erasing
      handleStateChange(canvas);
    });

    // Clean up event listeners when tool changes
    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
      canvas.off("erasing:end");
    };
  }, [activeTool, canvas, setLayers]);

  // Rectangle Drawing
  const startAddingRect = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas || !e.pointer) return;

    isDrawing.current = true;

    const pointer = e.pointer;
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: "#000000",
      strokeWidth: 2,
      selectable: false,
    });

    canvas.add(rect);
    canvas.renderAll();
    canvas.setActiveObject(rect);
  };

  const addingRect = (e: fabric.IEvent<MouseEvent>) => {
    if (!isDrawing.current || !canvas || !e.pointer) return;

    const pointer = e.pointer;
    const activeObj = canvas.getActiveObject() as fabric.Rect;

    if (!activeObj) return;

    const width = Math.abs(pointer.x - (activeObj.left as number));
    const height = Math.abs(pointer.y - (activeObj.top as number));

    // Ensure rectangle preserves initial corner position
    const originalX = activeObj.left as number;
    const originalY = activeObj.top as number;

    if (pointer.x < originalX) {
      activeObj.set({ left: pointer.x });
    }

    if (pointer.y < originalY) {
      activeObj.set({ top: pointer.y });
    }

    activeObj.set({
      width: width,
      height: height,
    });

    canvas.renderAll();
  };

  // Circle Drawing
  const startAddingCircle = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas || !e.pointer) return;

    isDrawing.current = true;

    const pointer = e.pointer;
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 0,
      fill: "transparent",
      stroke: "#000000",
      strokeWidth: 2,
      selectable: false,
      originX: "center",
      originY: "center",
    });

    canvas.add(circle);
    canvas.renderAll();
    canvas.setActiveObject(circle);
  };

  const addingCircle = (e: fabric.IEvent<MouseEvent>) => {
    if (!isDrawing.current || !canvas || !e.pointer) return;

    const pointer = e.pointer;
    const activeObj = canvas.getActiveObject() as fabric.Circle;

    if (!activeObj) return;

    const x = activeObj.left as number;
    const y = activeObj.top as number;

    const radius = Math.sqrt(
      Math.pow(pointer.x - x, 2) + Math.pow(pointer.y - y, 2)
    );

    activeObj.set({
      radius: radius,
    });

    canvas.renderAll();
  };

  const stopAddingShape = () => {
    isDrawing.current = false;
    if (canvas) {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        activeObj.set({
          selectable: true,
        });
        canvas.renderAll();
      }
    }
  };

  // Add Text
  const addText = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas || !e.pointer) return;

    const text = new fabric.Textbox("Click to edit text", {
      left: e.pointer.x,
      top: e.pointer.y,
      fontSize: 18,
      width: 200,
      fill: "#000000",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    // We want to add the text only once per click
    if (activeTool === "text") {
      canvas.off("mouse:down");
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className="flex items-center justify-center w-full h-full"
      style={{
        backgroundColor: "white",
        overflow: "auto",
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} />
      {!canvas && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-3"></div>
          <p className="text-sm text-gray-600">Loading canvas...</p>
        </div>
      )}
    </div>
  );
};
