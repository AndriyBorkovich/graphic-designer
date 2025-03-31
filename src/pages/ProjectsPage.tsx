import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, FileImage, FileText, FilePenLine, Trash2 } from "lucide-react";

// Project schema for validation
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  file_type: z.string().min(1, "File type is required"),
  description: z.string().optional(),
});

type Project = {
  id: string;
  name: string;
  file_type: string;
  description: string | null;
  file_size: string | null;
  created_at: string;
  updated_at: string;
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form for project creation
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      file_type: "Design",
      description: "",
    },
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    } else {
      fetchProjects();
    }
  }, [user, navigate]);

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (values: z.infer<typeof projectSchema>) => {
    try {
      if (!user) return;

      const newProject = {
        ...values,
        user_id: user.id,
        file_size: "0 KB",
      };

      const { error } = await supabase.from("projects").insert({
        ...newProject,
        name: newProject.name!, // Assert name is required
        file_type: newProject.file_type!, // Assert file_type is required
      });

      if (error) throw error;

      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });

      setIsCreateModalOpen(false);
      form.reset();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete a project
  const deleteProject = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", selectedProject.id);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      });

      setIsDeleteModalOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "image":
        return <FileImage className="h-5 w-5" />;
      case "text":
        return <FileText className="h-5 w-5" />;
      default:
        return <FilePenLine className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4318D1] hover:bg-[#3614B8]">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(createProject)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Awesome Design"
                            className="bg-[#333] border-[#444]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Design/Image/Text"
                            className="bg-[#333] border-[#444]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your project"
                            className="bg-[#333] border-[#444]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#4318D1] hover:bg-[#3614B8]"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-[#2A2A2A] mb-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#444] rounded-lg">
                <h3 className="text-xl font-medium text-[#888] mb-4">
                  No projects yet
                </h3>
                <p className="text-[#666] mb-6">
                  Create your first project to get started
                </p>
                <Button
                  className="bg-[#4318D1] hover:bg-[#3614B8]"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-[#2A2A2A] border-[#333] overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {getFileIcon(project.file_type)}
                          <CardTitle className="text-lg ml-2">
                            {project.name}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-[#888] hover:text-white hover:bg-red-900/20"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-[#888]">
                        {project.file_type} • {project.file_size || "0 KB"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-[#CCC] line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-[#777]">
                      <p>Created: {formatDate(project.created_at)}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">
            {loading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((project) => (
                  <Card
                    key={project.id}
                    className="bg-[#2A2A2A] border-[#333] overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {getFileIcon(project.file_type)}
                          <CardTitle className="text-lg ml-2">
                            {project.name}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-[#888] hover:text-white hover:bg-red-900/20"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-[#888]">
                        {project.file_type} • {project.file_size || "0 KB"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-[#CCC] line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-[#777]">
                      <p>Created: {formatDate(project.created_at)}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-[#CCC]">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedProject?.name}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={deleteProject}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
