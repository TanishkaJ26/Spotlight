import { getAllAssistants } from "@/actions/vapi";
import React from "react";
import AiAgentSidebar from "./_components/AiAgentSidebar";
import ModelSection from "./_components/ModelSection";

const page = async () => {
  const allAgents = await getAllAssistants();
  return (
    <div className="w-full flex flex-col md:flex-row h-auto md:h-[80vh] text-primary border border-border rounded-xl md:rounded-se-xl overflow-hidden">
      <AiAgentSidebar aiAgents={allAgents?.data || []} />
      <div className="flex-1 flex flex-col min-h-[60vh] md:min-h-0"> <ModelSection/></div>
    </div>
  );
};

export default page;
