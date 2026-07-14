import React from "react";
import OnBoarding from "./_components/OnBoarding";
import { Upload, Webcam } from "lucide-react";
import Image from "next/image";
import FeatureCard from "./_components/FeatureCard";
import FeatureSectionLayout from "./_components/FeatureSectionLayout";
import { potentialCustomer } from "@/lib/data";
import UserInfoCard from "@/components/ReusableComponent/LayoutComponents/UserInfoCard";

type Props = {};

const Pages = (props: Props) => {
  return (
    <div className="w-full mx-auto h-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-14">
        <div className="space-y-6">
          <h2 className="font-semibold text-4xl">
            Get maximum Conversion from your webinars
          </h2>
          <OnBoarding />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-content-center">
          <FeatureCard
            Icon={<Upload className="w-10 h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="#"
          />
          <FeatureCard
            Icon={<Webcam className="w-10 h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="/webinars"
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
        <FeatureSectionLayout
          heading="See how far along are your potential customers"
          link="/lead"
        >
          <div className="p-8 flex flex-col gap-6 items-start border rounded-3xl border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden h-full w-full shadow-2xl transition-all duration-500 hover:border-white/20 group">
            {/* Glowing Orb Top Right */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-purple-500/20 group-hover:blur-[100px]" />
            
            <div className="w-full flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                 <div className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                 </div>
                 <p className="text-white font-semibold text-sm tracking-wide">Active Conversions</p>
              </div>
              <p className="text-xs text-purple-300 font-semibold bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full shadow-sm">
                50 Pending
              </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full z-10 mt-2 pb-6">
              {potentialCustomer.slice(0, 3).map((customer, index) => (
                <div key={index} className="opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <UserInfoCard
                    customer={customer as any}
                    tags={customer.tags}
                    className="bg-white/5 border-white/10 shadow-md backdrop-blur-md"
                  />
                </div>
              ))}
            </div>
            
            {/* Fade out gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-20 pointer-events-none rounded-b-3xl" />
          </div>
        </FeatureSectionLayout>

        <FeatureSectionLayout
          heading="See the list of your current customers"
          link="/lead"
        >
          <div className="p-8 flex flex-col gap-6 items-start border rounded-3xl border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden h-full w-full shadow-2xl transition-all duration-500 hover:border-white/20 group">
            {/* Glowing Orb Bottom Left */}
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 transition-all duration-700 group-hover:bg-blue-500/20 group-hover:blur-[100px]" />

            <div className="w-full flex justify-between items-center z-10 mb-2">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                 <p className="text-white font-semibold text-sm tracking-wide">Recent Customers</p>
              </div>
              <p className="text-xs text-blue-300 font-medium bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                Updated Today
              </p>
            </div>

            {/* Wrapped Card Layout */}
            <div className="w-full flex flex-wrap gap-4 pb-6 pt-2 z-10 justify-center">
              {potentialCustomer.slice(0, 4).map((customer, index) => (
                 <div key={index} className="w-[45%] min-w-[200px] flex-grow transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                   <UserInfoCard
                     customer={customer as any}
                     tags={customer.tags}
                     className="bg-black/60 border-white/10 shadow-2xl backdrop-blur-xl h-full"
                   />
                 </div>
              ))}
            </div>
            
            {/* Subtle bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none rounded-b-3xl" />
          </div>
        </FeatureSectionLayout>
      </div>
    </div>
  );
};

export default Pages;
