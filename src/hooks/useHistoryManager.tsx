
import { useState, useCallback } from "react";

const MAX_HISTORY_LENGTH = 50; // Limit history length to prevent memory issues

export function useHistoryManager(initialState?: string) {
  const [history, setHistory] = useState<string[]>(initialState ? [initialState] : []);
  const [currentIndex, setCurrentIndex] = useState<number>(initialState ? 0 : -1);
  
  // Check if undo is available
  const canUndo = currentIndex > 0;
  
  // Check if redo is available
  const canRedo = currentIndex < history.length - 1;
  
  // Get current state
  const currentState = history[currentIndex];
  
  // Add a new state to history
  const pushState = useCallback((newState: string) => {
    // Don't add if it's the same as the current state
    if (newState === history[currentIndex]) {
      return;
    }
    
    setHistory(prevHistory => {
      // Remove any future states (redo stack) and add the new state
      const updatedHistory = [...prevHistory.slice(0, currentIndex + 1), newState];
      
      // Trim history if it exceeds max length
      if (updatedHistory.length > MAX_HISTORY_LENGTH) {
        return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
      }
      
      return updatedHistory;
    });
    
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      
      // If we exceeded max history length, adjust index
      if (newIndex >= MAX_HISTORY_LENGTH) {
        return MAX_HISTORY_LENGTH - 1;
      }
      
      return newIndex;
    });
  }, [history, currentIndex]);
  
  // Undo to previous state
  const undo = useCallback(() => {
    if (!canUndo) return null;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canUndo, currentIndex, history]);
  
  // Redo to next state
  const redo = useCallback(() => {
    if (!canRedo) return null;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canRedo, currentIndex, history]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);
  
  // Replace entire history
  const setInitialHistory = useCallback((initialState: string) => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, []);
  
  return {
    canUndo,
    canRedo,
    currentState,
    pushState,
    undo,
    redo,
    clearHistory,
    setInitialHistory,
    historyLength: history.length,
    currentIndex
  };
}
