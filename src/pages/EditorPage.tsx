
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
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .eq("id", projectId)
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
        return;
      }

      if (data) {
        setProjectName(data.name);
        document.title = `${data.name} | Editor`;
      }
    } catch (error: any) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex h-[calc(100vh-4rem)]">
        <EditorLayout 
          activeTool={activeTool} 
          setActiveTool={setActiveTool}
          projectId={projectId}
          projectName={projectName}
        />
      </main>
    </div>
  );
};

export default EditorPage;
