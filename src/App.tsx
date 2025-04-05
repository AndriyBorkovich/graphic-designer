
import { useState, useEffect } from "react";
import { Routes, Route, useBeforeUnload, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import EditorPage from "./pages/EditorPage";
import ProjectsPage from "./pages/ProjectsPage";
import DocumentationPage from "./pages/DocumentationPage";
import { ConfirmDialog } from "./components/dialogs/ConfirmDialog";
import { useToast } from "./hooks/use-toast";

function App() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);
  const location = useLocation();

  // Listen for events from editor pages to track unsaved changes
  useEffect(() => {
    const handleUnsavedChanges = (e: CustomEvent) => {
      setHasUnsavedChanges(e.detail.hasUnsavedChanges);
    };

    window.addEventListener(
      "editor:unsavedChanges" as any,
      handleUnsavedChanges as EventListener
    );

    return () => {
      window.removeEventListener(
        "editor:unsavedChanges" as any,
        handleUnsavedChanges as EventListener
      );
    };
  }, []);

  // Show custom dialog when trying to close/refresh the window
  useBeforeUnload((event) => {
    if (hasUnsavedChanges) {
      // This will trigger browser's native dialog, which we can't fully customize
      // But we will at least set a custom message
      const message = "You have unsaved changes. If you leave, your changes will be lost.";
      event.preventDefault();
      event.returnValue = message;
      return message;
    }
  });

  // Reset unsaved changes when navigating away from editor
  useEffect(() => {
    if (!location.pathname.includes('/editor')) {
      setHasUnsavedChanges(false);
    }
  }, [location]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/editor/:projectId?" element={<EditorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
