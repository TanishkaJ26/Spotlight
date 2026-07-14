"use client";

import React from "react";
import PipelineLayout from "./PipelineLayout";
import { AttendedTypeEnum } from "@prisma/client";
import { formatColumnTitle } from "./utils";
import { AttendanceData } from "@/lib/type";

type PipelineBoardProps = {
  initialData: Record<AttendedTypeEnum, AttendanceData>;
  webinarId: string;
  tags: string[];
};

export default function PipelineBoard({ initialData, tags }: PipelineBoardProps) {
  return (
    <div className="flex flex-col md:flex-row md:overflow-x-auto pb-6 pt-2 gap-6 scrollbar-hide h-full md:items-start min-h-[75vh] w-full snap-y md:snap-x snap-mandatory px-4 md:px-0">
      {Object.entries(initialData).map(([columnType, columnData]) => (
        <div key={columnType} className="snap-start md:snap-align-none shrink-0 w-full md:w-auto max-h-full">
          <PipelineLayout
            columnId={columnType as AttendedTypeEnum}
            title={formatColumnTitle(columnType as AttendedTypeEnum)}
            count={columnData.count}
            users={columnData.users as any}
            tags={tags}
          />
        </div>
      ))}
    </div>
  );
}
