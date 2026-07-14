import UserInfoCard from "@/components/ReusableComponent/LayoutComponents/UserInfoCard";
import { Badge } from "@/components/ui/badge";
import { Attendee } from "@prisma/client";
import React from "react";

type Props = {
  columnId: string;
  title: string;
  count: number;
  users: Attendee[];
  tags: string[];
};

const PipelineLayout = ({ columnId, title, count, users, tags }: Props) => {
  return (
    <div className="flex-shrink-0 w-full md:w-[350px] p-4 sm:p-5 border border-white/10 bg-card/40 rounded-2xl backdrop-blur-xl shadow-lg flex flex-col h-full max-h-[80vh] md:max-h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-transparent z-10 pb-2 border-b border-white/5">
        <h2 className="font-semibold text-base sm:text-lg text-foreground tracking-tight">{title}</h2>
        <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors border-0">
          {count}
        </Badge>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-hide min-h-[150px]">
        {users.map((user, index) => (
          <div key={user.id} className="mb-3">
            <UserInfoCard
              customer={user}
              tags={tags}
              className="hover:shadow-md hover:border-primary/30 transition-all"
            />
          </div>
        ))}
        {users.length === 0 && (
           <div className="h-full flex items-center justify-center text-muted-foreground text-sm opacity-50 py-10">
             No attendees yet
           </div>
        )}
      </div>
    </div>
  );
};

export default PipelineLayout;
