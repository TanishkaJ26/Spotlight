import PageHeader from "@/components/ReusableComponent/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeadIcon from "@/icons/LeadIcon";
import PipelineIcon from "@/icons/PipelineIcon";
import { Webcam } from "lucide-react";
import React from "react";
import { onAuthenticateUser } from "@/actions/auth";
import { prismaClient } from "@/lib/prismaClient";

const formatTag = (tag: string) => {
  const map: Record<string, string> = {
    REGISTERED: "Registered",
    ATTENDED: "Webinar Attended",
    ADDED_TO_CART: "Added to Cart",
    FOLLOW_UP: "Follow Up",
    BREAKOUT_ROOM: "Breakout Room",
    CONVERTED: "Converted",
  };
  return map[tag] || tag;
};

const page = async () => {
  const auth = await onAuthenticateUser();
  if (!auth.user) return null;

  // Get all unique attendees for this presenter's webinars
  const attendances = await prismaClient.attendance.findMany({
    where: {
      webinar: {
        presenterId: auth.user.id,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  // Group by attendee to combine tags
  const leadsMap = new Map<string, any>();
  attendances.forEach((att) => {
    if (!leadsMap.has(att.attendeeId)) {
      leadsMap.set(att.attendeeId, {
        id: att.user.id,
        name: att.user.name,
        email: att.user.email,
        phone: att.user.phone || "N/A", // Use collected phone or default to N/A
        tags: new Set([formatTag(att.attendedType)]),
      });
    } else {
      leadsMap.get(att.attendeeId).tags.add(formatTag(att.attendedType));
    }
  });

  const leads = Array.from(leadsMap.values()).map((lead) => ({
    ...lead,
    tags: Array.from(lead.tags),
  }));

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<Webcam className="w-3 h-3" />}
        mainIcon={<LeadIcon className="w-12 h-12 " />}
        rightIcon={<PipelineIcon className="w-3 h-3" />}
        heading="The home to all your customers"
        placeholder="Search customer..."
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Phone
            </TableHead>
            <TableHead className="text-sm text-muted-foreground text-right pr-4">
              Tags
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads?.map((lead, idx) => (
            <TableRow key={idx} className="border-0">
              <TableCell className="font-medium">{lead?.name}</TableCell>
              <TableCell>{lead?.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {lead?.phone}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  {lead?.tags?.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {leads.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-8"
              >
                No customers found yet. Share your webinars to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
