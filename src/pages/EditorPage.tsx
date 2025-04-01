
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EditorLayout } from "@/components/editor/EditorLayout";

const EditorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <EditorLayout />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
