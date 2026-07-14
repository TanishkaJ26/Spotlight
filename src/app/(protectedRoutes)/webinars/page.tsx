import { Webcam } from "lucide-react";
import React from "react";
import LeadIcon from "@/icons/LeadIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeIcon from "@/icons/HomeIcon";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { Webinar, WebinarStatusEnum } from "@prisma/client";
import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { getWebinarByPresenterId } from "@/actions/webinar";
import WebinarCard from "./_components/WebinarCard";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    webinarStatus: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const { webinarStatus } = await searchParams;
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/");
  }

  const webinars =
    (await getWebinarByPresenterId(
      checkUser?.user?.id,
      webinarStatus as WebinarStatusEnum,
    )) || [];

  const now = new Date();
  const upcomingWebinars = webinars.filter(
    (w) =>
      w.webinarStatus !== "ENDED" &&
      w.webinarStatus !== "CANCELLED" &&
      new Date(w.startTime) >= now,
  );
  const endedWebinars = webinars.filter(
    (w) =>
      w.webinarStatus === "ENDED" ||
      w.webinarStatus === "CANCELLED" ||
      new Date(w.startTime) < now,
  );

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Webcam className="w-12 h-12 " />}
        rightIcon={<LeadIcon className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search option..."
      >
        <TabsList className="w-full sm:w-auto justify-center sm:justify-start bg-transparent gap-2">
          <TabsTrigger
            value="all"
            className="bg-transparent border border-transparent data-[state=active]:bg-secondary data-[state=active]:border-border text-muted-foreground data-[state=active]:text-secondary-foreground rounded-lg px-6 py-2"
          >
            <Link href="/webinars?webinarStatus=all">All</Link>
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="bg-transparent border border-transparent data-[state=active]:bg-secondary data-[state=active]:border-border text-muted-foreground data-[state=active]:text-secondary-foreground rounded-lg px-6 py-2"
          >
            <Link href="/webinars?webinarStatus=upcoming">Upcoming</Link>
          </TabsTrigger>
          <TabsTrigger
            value="ended"
            className="bg-transparent border border-transparent data-[state=active]:bg-secondary data-[state=active]:border-border text-muted-foreground data-[state=active]:text-secondary-foreground rounded-lg px-6 py-2"
          >
            <Link href="/webinars?webinarStatus=ended">Ended</Link>
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start gap-x-6 gap-y-10"
      >
        {webinars?.length > 0 ? (
          webinars.map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Webinar found
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="upcoming"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start gap-x-6 gap-y-10"
      >
        {upcomingWebinars.length > 0 ? (
          upcomingWebinars.map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No upcoming webinars found
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="ended"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start gap-x-6 gap-y-10"
      >
        {endedWebinars.length > 0 ? (
          endedWebinars.map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No ended webinars found
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Page;
