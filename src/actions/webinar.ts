'use server'

import { WebinarFormState } from "@/store/useWebinarStore"
import { onAuthenticateUser } from "./auth"

function combinedDateTime (
  date: Date,
  timeStr: string,
  timeFormat: 'AM' | 'PM'
) : Date {
  const [hourStr, minutesStr] = timeStr.split(':')
  let hours = Number.parseInt(minutesStr || '0', 10)
  const minutes = Number.parseInt(minutesStr || '0', 10)

  if(timeFormat === 'PM' && hours < 12){
    hours += 12
  }else if(timeFormat === 'AM' && hours=== 12 ){
    hours=0
  }

  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

export const createWebinar = async (formData: WebinarFormState) => {
  try{
    const user = await onAuthenticateUser()
    if(!user.user){
      return {status: 401, message: 'Unauthorized'}
    }
    
    
    // TODO: check if user has a subscription

    const presenterid = user.user.id
    console.log('Form Data:', formData, presenterid);

    if(!formData.basicInfo.webinarName){
      return {status: 404, message: 'Webinar name is required'}
    }

    if(!formData.basicInfo.date){
      return {status: 404, message: 'Webinar date is required'}
    }

    if(!formData.basicInfo.time){
      return {status: 404, message: 'Webinar time is required'}
    }

    const combinedDateTime = combinedDateTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormat || 'AM'
    )
  }catch(error){}
}