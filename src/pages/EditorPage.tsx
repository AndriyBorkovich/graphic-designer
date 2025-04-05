import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const EditorPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState<string>("Untitled Project");
  const [canvasData, setCanvasData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    // If we have a project ID, fetch the project details
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, user, navigate]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("name, canvas_data")
        .eq("id", projectId)
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
        return;
      }

      if (data) {
        setProjectName(data.name as string);
        setCanvasData(data.canvas_data as string);
        document.title = `${data.name} | Editor`;
      }
    } catch (error: any) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-3"></div>
            <p className="text-sm text-gray-600">Loading project...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-auto">
      <Navbar />
      <main className="flex-grow flex h-[calc(100vh-4rem)] w-auto">
        <EditorLayout
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          projectId={projectId}
          projectName={projectName}
          initialCanvasData={canvasData}
        />
      </main>
    </div>
  );
};

export default EditorPage;
