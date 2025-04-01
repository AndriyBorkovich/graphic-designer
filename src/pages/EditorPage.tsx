
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { Toolbox } from "@/components/editor/Toolbox";

const EditorPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex h-[calc(100vh-8rem)]">
        <Toolbox activeTool={activeTool} setActiveTool={setActiveTool} />
        <EditorLayout activeTool={activeTool} />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
