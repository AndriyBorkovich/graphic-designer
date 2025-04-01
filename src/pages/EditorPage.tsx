
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { GlobalSidebar } from "@/components/editor/GlobalSidebar";

const EditorPage: React.FC = () => {
  const [activeGlobalTool, setActiveGlobalTool] = useState<string | null>("draw");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex">
        <GlobalSidebar 
          activeTool={activeGlobalTool} 
          setActiveTool={setActiveGlobalTool}
        />
        <EditorLayout />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
