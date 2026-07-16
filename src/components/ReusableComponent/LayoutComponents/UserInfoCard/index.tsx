import { cn } from "@/lib/utils";
import { Attendee } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import React from "react";

type Props = {
  customer: Attendee & { attendedAt?: Date };
  tags: string[];
  className?: string;
};

const UserInfoCard = ({ customer, tags, className }: Props) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col p-4 gap-3 rounded-xl border border-white/10 backdrop-blur-md bg-secondary/30 transition-all duration-300",
        className,
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1 flex-1 min-w-0 mr-2">
          <h3 className="font-semibold text-sm text-foreground tracking-tight truncate">{customer.name}</h3>
          <p className="text-xs text-muted-foreground truncate" title={customer.email}>{customer.email}</p>
          {customer.phone && (
            <p className="text-xs text-muted-foreground truncate" title={customer.phone}>{customer.phone}</p>
          )}
        </div>
        {customer.callStatus && (
          <Badge 
            variant={customer.callStatus === 'COMPLETED' ? 'default' : customer.callStatus === 'InProgress' ? 'secondary' : 'outline'} 
            className="text-[10px] whitespace-nowrap"
          >
            {customer.callStatus === 'InProgress' ? 'In Progress' : customer.callStatus}
          </Badge>
        )}
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs font-medium px-2.5 py-1 rounded-md border border-primary/20 bg-primary/10 text-primary shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></span>
          Joined:{" "}
          {new Date(customer.attendedAt || customer.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
