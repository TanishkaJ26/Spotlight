"use client";
import { registerAttendee } from "@/actions/attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WebinarStatusEnum } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({
  webinarId,
  webinarStatus,
  onRegistered,
}: Props) => {
  const [name, setName] = useState('');  
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return "Get Reminder";
      case WebinarStatusEnum.WAITING_ROOM:
        return "Get Reminder";
      case WebinarStatusEnum.LIVE:
        return "Join Webinar";
      default:
        return "Register";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try{
      const res = await registerAttendee(
        email, 
        name,
        webinarId,
      )
    
    if(!res.success){
      throw new Error (res.message || 'Something went wrong!')  
    }
    if(!res.success){
      throw new Error (res.message || 'Something went wrong!')
    }

    if(res.data?.user){
      setAttendee({
        id: res.data.user.id,
        name:res.data.user.name,
        email:res.data.user.email,
        callStatus: 'PENDING'
      })
    }
  
  }catch(error){}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } rounded-md px-4 py-2 text-primary-foreground text-sm font-semibold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse"></span>
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0 bg-tansparent" showCloseButton={false}>
        <DialogHeader className="justify-center items-center border border-input rounded-xl p-4 bg-background">
          <DialogTitle className="text-center text-lg font-semibold mb-4">
            {webinarStatus === WebinarStatusEnum.LIVE
              ? "Join the Webinar"
              : "Join the Waitlist"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full"></form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
