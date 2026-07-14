import getWebinarAttendance from "@/actions/attendance";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import HomeIcon from "@/icons/HomeIcon";
import LeadIcon from "@/icons/LeadIcon";
import PipelineIcon from "@/icons/PipelineIcon";
import React from "react";
import PipelineBoard from "./_components/PipelineBoard";

type Props = {
  params: Promise<{
    webinarId: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId)

  if(!pipelineData.data){
    return (
      <div className="text-3xl h-[400px] flex justify-center items-center">
        No Pipelines Found
      </div>
    )
  }
  return (
    <div className="w-full flex flex-col gap-8 h-[calc(100vh-6rem)]">
      <PageHeader
        leftIcon={<LeadIcon className="w-4 h-4" />}
        mainIcon={<PipelineIcon className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-3 h-3" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name, Tag or Email"
      ></PageHeader>

      <div className="flex-1 overflow-y-auto md:overflow-hidden scrollbar-hide">
        <PipelineBoard 
          initialData={pipelineData.data} 
          webinarId={webinarId} 
          tags={pipelineData.webinarTags} 
        />
      </div>
    </div>
  );
};

export default page;
