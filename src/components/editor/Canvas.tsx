
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";

interface CanvasProps {
  activeTool: string;
  zoom: number;
  setSelectedObject: (object: any) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ activeTool, zoom, setSelectedObject }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1600,
      height: 900,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    
    setCanvas(fabricCanvas);
    
    // Selection event
    fabricCanvas.on("selection:created", (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
    });
    
    fabricCanvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
    });
    
    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [setSelectedObject]);
  
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
        // Set up eraser mode - in fabric.js this is just removing selected objects
        break;
    }
    
    // Clean up event listeners when tool changes
    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  }, [activeTool, canvas]);
  
  // Update zoom
  useEffect(() => {
    if (!canvas) return;
    
    const zoomRatio = zoom / 100;
    canvas.setZoom(zoomRatio);
    canvas.setWidth(1600 * zoomRatio);
    canvas.setHeight(900 * zoomRatio);
    
    canvas.renderAll();
  }, [zoom, canvas]);
  
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
      fill: 'transparent',
      stroke: '#000000',
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
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      selectable: false,
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
    
    const radius = Math.sqrt(
      Math.pow(pointer.x - (activeObj.left as number), 2) +
      Math.pow(pointer.y - (activeObj.top as number), 2)
    ) / 2;
    
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
    
    const text = new fabric.Textbox('Click to edit text', {
      left: e.pointer.x,
      top: e.pointer.y,
      fontSize: 18,
      width: 200,
      fill: '#000000',
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
    <div className="relative bg-white shadow-lg">
      <canvas ref={canvasRef} className="border border-gray-300" />
      {!canvas && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};
