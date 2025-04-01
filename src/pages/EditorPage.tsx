
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EditorLayout } from "@/components/editor/EditorLayout";

const EditorPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex h-[calc(100vh-8rem)]">
        <EditorLayout activeTool={activeTool} setActiveTool={setActiveTool} />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
