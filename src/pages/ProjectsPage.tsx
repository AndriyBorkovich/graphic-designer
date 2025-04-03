import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarNav } from "@/components/editor/SidebarNav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileImage, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  file_type: string;
  description: string | null;
  file_size: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("projects");
  const [newProject, setNewProject] = useState({
    name: "",
    file_type: "graphic",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    //console.log("user", user);
    if (!user) {
      navigate("/sign-in");
      return;
    }

    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Using 'any' to bypass TypeScript errors with Supabase tables
      const { data, error } = await supabase
        .from("projects" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Convert to unknown first then to Project[] to satisfy TypeScript
      setProjects(data as unknown as Project[]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    // Validate project name
    if (!newProject.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (newProject.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    } else if (newProject.name.length > 50) {
      newErrors.name = "Project name must be less than 50 characters";
    }

    // Validate description (optional but with length limit)
    if (newProject.description && newProject.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleCreateProject = async () => {
    if (validateInputs()) {
      if (!user) return;

      try {
        const projectData = {
          user_id: user.id,
          name: newProject.name,
          file_type: newProject.file_type,
          description: newProject.description || null,
          file_size: "1920x1080",
        };

        // Using 'any' to bypass TypeScript errors with Supabase tables
        const { error } = await supabase
          .from("projects" as any)
          .insert(projectData as any);

        if (error) {
          throw error;
        }

        setDialogOpen(false);
        toast.success("Project created successfully");
        setNewProject({
          name: "",
          file_type: "graphic",
          description: "",
        });

        fetchProjects();
      } catch (error) {
        console.error("Error creating project:", error);
        toast.error("Failed to create project");
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      // Using 'any' to bypass TypeScript errors with Supabase tables
      const { error } = await supabase
        .from("projects" as any)
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setProjects(projects.filter((project) => project.id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleOpenEditor = (project: Project) => {
    // Navigate to the editor page with the project ID
    navigate(`/editor/${project.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex">
        <div className="w-16 shrink-0">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-grow container mx-auto py-8 px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My projects</h1>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new project</DialogTitle>
                  <DialogDescription>
                    Create a new design project to work on
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      id="name"
                      placeholder="My Awesome Project"
                      value={newProject.name}
                      onChange={(e) => {
                        setNewProject({ ...newProject, name: e.target.value });
                        if (errors.name) {
                          setErrors({ ...errors, name: "" });
                        }
                      }}
                      className={cn(
                        errors.name &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Project description..."
                      value={newProject.description}
                      maxLength={200}
                      onChange={(e) => {
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        });
                        if (errors.description) {
                          setErrors({ ...errors, description: "" });
                        }
                      }}
                      className={cn(
                        errors.description &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {newProject.description.length}/200 characters
                    </p>
                  </div>
                  <Button onClick={handleCreateProject} className="w-full">
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div
                    className="h-40 bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => handleOpenEditor(project)}
                  >
                    <FileImage className="h-16 w-16 text-gray-400" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {new Date(project.created_at).toLocaleDateString()} •{" "}
                      {project.file_size}
                    </CardDescription>
                  </CardHeader>
                  {project.description && (
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {project.description}
                      </p>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEditor(project)}
                    >
                      Open Project
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No projects yet
              </h3>
              <p className="text-gray-500 mt-1">
                Create your first design project to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;
