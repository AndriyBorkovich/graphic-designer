
import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { useNavigate } from "react-router-dom";

const EditorPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>("select");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex h-[calc(100vh-6rem)]">
        <EditorLayout activeTool={activeTool} setActiveTool={setActiveTool} />
      </main>
    </div>
  );
};

export default EditorPage;
