
import { useState, useRef, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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

export const useCanvasHistory = (
  fabricCanvas: fabric.Canvas | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>,
  markUnsavedChanges: () => void
) => {
  // History stacks
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  // Refs to track current state
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isPerformingUndoRedo = useRef(false);

  // Update refs when states change
  useEffect(() => {
    undoStackRef.current = undoStack;
    redoStackRef.current = redoStack;
  }, [undoStack, redoStack]);

  // Save canvas state to history
  const saveState = useCallback(() => {
    if (!fabricCanvas || isPerformingUndoRedo.current) return;
    
    try {
      const currentState = JSON.stringify(
        fabricCanvas.toJSON(['id', 'name', 'type', 'visible'])
      );
      
      // Only save if state is different from last state
      if (undoStackRef.current.length > 0) {
        const lastState = undoStackRef.current[undoStackRef.current.length - 1];
        if (lastState === currentState) return;
      }
      
      // Add current state to undo stack
      const newUndoStack = [...undoStackRef.current, currentState];
      setUndoStack(newUndoStack);
      undoStackRef.current = newUndoStack;
      
      // Clear redo stack
      setRedoStack([]);
      redoStackRef.current = [];
      
      // Mark changes as unsaved
      markUnsavedChanges();
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [fabricCanvas, markUnsavedChanges]);

  // Handle undo operation
  const handleUndo = useCallback(() => {
    if (!fabricCanvas || undoStackRef.current.length <= 1) {
      toast.info('Nothing to undo');
      return;
    }

    try {
      isPerformingUndoRedo.current = true;
      
      // Save current state to redo stack
      const currentState = JSON.stringify(
        fabricCanvas.toJSON(['id', 'name', 'type', 'visible'])
      );
      
      const newRedoStack = [...redoStackRef.current, currentState];
      setRedoStack(newRedoStack);
      redoStackRef.current = newRedoStack;
      
      // Remove current state from undo stack
      const newUndoStack = [...undoStackRef.current];
      newUndoStack.pop(); // Remove current state
      
      // Get previous state
      const previousState = newUndoStack[newUndoStack.length - 1];
      
      // Update undo stack
      setUndoStack(newUndoStack);
      undoStackRef.current = newUndoStack;

      // Apply previous state to canvas
      if (previousState) {
        fabricCanvas.loadFromJSON(JSON.parse(previousState), () => {
          fabricCanvas.renderAll();
          
          // Update layers based on loaded objects
          updateLayersFromCanvas(fabricCanvas, setLayers);
          
          // Mark changes as unsaved
          markUnsavedChanges();
          
          isPerformingUndoRedo.current = false;
          
          toast.success('Undo successful');
        });
      }
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Failed to undo');
      isPerformingUndoRedo.current = false;
    }
  }, [fabricCanvas, markUnsavedChanges, setLayers]);

  // Handle redo operation
  const handleRedo = useCallback(() => {
    if (!fabricCanvas || redoStackRef.current.length === 0) {
      toast.info('Nothing to redo');
      return;
    }

    try {
      isPerformingUndoRedo.current = true;
      
      // Get state to restore from redo stack
      const newRedoStack = [...redoStackRef.current];
      const stateToRestore = newRedoStack.pop();
      
      // Update redo stack
      setRedoStack(newRedoStack);
      redoStackRef.current = newRedoStack;

      if (stateToRestore) {
        // Save current state to undo stack
        const currentState = JSON.stringify(
          fabricCanvas.toJSON(['id', 'name', 'type', 'visible'])
        );
        
        const newUndoStack = [...undoStackRef.current, currentState];
        setUndoStack(newUndoStack);
        undoStackRef.current = newUndoStack;

        // Apply redo state to canvas
        fabricCanvas.loadFromJSON(JSON.parse(stateToRestore), () => {
          fabricCanvas.renderAll();
          
          // Update layers based on loaded objects
          updateLayersFromCanvas(fabricCanvas, setLayers);
          
          // Mark changes as unsaved
          markUnsavedChanges();
          
          isPerformingUndoRedo.current = false;
          
          toast.success('Redo successful');
        });
      }
    } catch (error) {
      console.error('Error during redo:', error);
      toast.error('Failed to redo');
      isPerformingUndoRedo.current = false;
    }
  }, [fabricCanvas, markUnsavedChanges, setLayers]);

  // Initialize canvas history
  const initializeHistory = useCallback((canvas: fabric.Canvas) => {
    try {
      // Save initial state
      const initialState = JSON.stringify(
        canvas.toJSON(['id', 'name', 'type', 'visible'])
      );
      
      setUndoStack([initialState]);
      undoStackRef.current = [initialState];
      
      // Setup event listeners for changes
      setupCanvasEventListeners(canvas, saveState);
    } catch (error) {
      console.error('Error initializing canvas history:', error);
    }
  }, [saveState]);

  return {
    undoStack,
    redoStack,
    handleUndo,
    handleRedo,
    saveState,
    initializeHistory,
    isUndoDisabled: undoStack.length <= 1,
    isRedoDisabled: redoStack.length === 0
  };
};

// Helper function to update layers state from canvas objects
const updateLayersFromCanvas = (
  canvas: fabric.Canvas,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
) => {
  try {
    const loadedObjects = canvas.getObjects() as FabricObject[];
    const newLayers: Layer[] = loadedObjects.map((obj) => ({
      id: obj.id || uuidv4(),
      name: obj.name || 'Imported Object',
      type: (obj.type as Layer['type']) || 'shape',
      visible: obj.visible !== false,
      object: obj,
    }));

    // Add background layer if not present
    if (!newLayers.find((layer) => layer.type === 'background')) {
      newLayers.unshift({
        id: uuidv4(),
        name: 'Background',
        type: 'background',
        visible: true,
        object: canvas as unknown as fabric.Object,
      });
    }

    setLayers(newLayers);
  } catch (error) {
    console.error('Error updating layers from canvas:', error);
  }
};

// Setup canvas event listeners with improved change detection
const setupCanvasEventListeners = (
  canvas: fabric.Canvas,
  saveState: () => void
) => {
  let modificationTimeout: NodeJS.Timeout;

  // Debounced state saving
  const saveStateDebounced = () => {
    clearTimeout(modificationTimeout);
    modificationTimeout = setTimeout(() => {
      saveState();
    }, 300); // Debounce time of 300ms
  };

  // Object modifications
  canvas.on('object:modified', saveStateDebounced);
  canvas.on('object:added', saveStateDebounced);
  canvas.on('object:removed', saveStateDebounced);
  
  // Path creation completed (for drawing)
  canvas.on('path:created', saveStateDebounced);

  // Text editing
  canvas.on('text:changed', saveStateDebounced);
  
  // Background color changes
  canvas.on('background:changed', saveStateDebounced);

  // Track object movement
  canvas.on('mouse:down', (options) => {
    if (options.target) {
      // Save state before modifying
      canvas.movementSnapshot = JSON.stringify(
        canvas.toJSON(['id', 'name', 'type', 'visible'])
      );
    }
  });

  canvas.on('mouse:up', () => {
    if (canvas.movementSnapshot) {
      const currentState = JSON.stringify(
        canvas.toJSON(['id', 'name', 'type', 'visible'])
      );
      
      if (canvas.movementSnapshot !== currentState) {
        saveState();
      }
      
      delete canvas.movementSnapshot;
    }
  });
};
