
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookIcon } from "lucide-react";
import { SidebarNav } from "@/components/editor/SidebarNav";

// Documentation sections
const sections = [
  { id: "introduction", title: "Introduction", content: `Welcome to the Interactive Graphic Editor documentation. This guide provides comprehensive information about using the editor's features and tools. Whether you're a beginner or advanced user, you'll find helpful instructions to create and edit graphic content effectively.` },
  { id: "getting-started", title: "Getting started", content: `To begin using the Graphic Editor, create a new project or open an existing one from the Projects page. Once in the editor, you'll see the canvas in the center with tools on the left side and properties on the right.` },
  { id: "interface", title: "Interface", content: `The editor interface consists of a main canvas area, tools sidebar, layers panel, and properties panel. The top navigation bar allows you to save your work, undo/redo actions, and access additional settings.` },
  { id: "core-tools", title: "Core tools", content: `The core tools include: Selection tool for moving and resizing objects, Draw tool for freehand drawing, Shape tools for creating rectangles, circles and other geometric forms, Text tool for adding and editing text, and Color picker for changing object colors.` },
  { id: "layers", title: "Layers", content: `The Layers panel helps you organize your design elements. You can reorder layers by dragging, hide/show layers with the visibility toggle, group layers together, and adjust layer opacity and blending modes.` },
  { id: "advanced", title: "Advanced", content: `Advanced features include masks, filters, effects, and transformations. These allow you to create more complex designs with gradient fills, drop shadows, blur effects, and non-destructive editing capabilities.` },
  { id: "shortcuts", title: "Shortcuts", content: `Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+S (Save), Spacebar+Drag (Pan canvas), Ctrl++ (Zoom in), Ctrl+- (Zoom out), Delete (Remove selected), Ctrl+G (Group selected), Ctrl+D (Duplicate).` },
  { id: "troubleshooting", title: "Troubleshooting", content: `Common issues include: canvas rendering problems (try clearing browser cache), tool not responding (check if you have an active selection), changes not saving (verify your connection and permissions), and performance issues (reduce project complexity or close other applications).` },
  { id: "help", title: "Help", content: `For additional help, visit our support forum, check tutorial videos, or contact our support team. We're continuously improving the editor based on user feedback.` },
  { id: "updates", title: "Updates", content: `Stay informed about the latest features and improvements. We regularly update the editor with new tools, performance enhancements, and bug fixes to provide you with the best design experience.` },
];

const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter sections based on search query
  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current section content
  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex h-[calc(100vh-4rem)]">
        <div className="flex w-full">
          {/* Left sidebar - Documentation Nav */}
          <div className="w-64 bg-[#2A2A2A] text-white flex flex-col">
            <SidebarNav 
              activeTab="documentation" 
              setActiveTab={() => {}} 
              className="border-r border-gray-800"
            />
            {/* Documentation sections navigation */}
            <div className="flex-1 flex flex-col">
              <div className="p-4">
                <Input
                  className="bg-[#3A3A3A] border-gray-700 text-white placeholder:text-gray-400"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="flex-1">
                <div className="px-2 py-2">
                  {filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors",
                        activeSection === section.id
                          ? "bg-[#4318D1] text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#1E1E1E] text-gray-200 p-8 overflow-auto">
            {currentSection && (
              <div>
                <h1 className="text-3xl font-bold mb-6">{currentSection.title}</h1>
                <p className="text-lg leading-relaxed max-w-3xl">
                  {currentSection.content}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;
