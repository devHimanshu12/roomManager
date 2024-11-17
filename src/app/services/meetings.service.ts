import { Injectable } from '@angular/core';
import { Meeting } from '../models/meeting';
import { ROOMS } from '../data';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  rooms = ROOMS;

  constructor() { }

   /**
   * Fetch meetings from localStorage
   */
  fetchMeetings(): Meeting[] {
    const storedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    return storedMeetings
  }

  fetchAvailableRooms(date:string,fromTime:string,toTime:string){
    // convert the time range to Date object for later comparision
    const from = new Date(`${date}T${fromTime}`)
    const to = new Date(`${date}T${toTime}`)

    // filter rooms that are booked during the selected time slot and date
    const bookedSlots = this.fetchMeetings()
    const bookedRoomIds = bookedSlots.filter((slot)=>{

      const bookedDate = slot.date;
      const bookedFromTime = new Date(`${bookedDate}T${slot.from}`)
      const bookedToTime = new Date(`${bookedDate}T${slot.to}`)

      return(
        bookedDate === date && // here i am first checking if the date selected is present in booked dates
        (from < bookedToTime && to > bookedFromTime) // checking for time overlap
      )
    }).map((slot)=> Number(slot.room)) // getting selected rooms

    const availableRooms = this.rooms.filter(
      (room)=>{
        return !bookedRoomIds.includes(room.id)
      }
    )

    return availableRooms;
  }

  /**
   * Deletes a meeting from the list by ID.
   * @param id - Meeting ID to be deleted
   */
  deleteMeeting(selectedItem: Meeting): void {
    const remainingItems = this.fetchMeetings().filter((item) => item.id !== selectedItem.id);
    localStorage.setItem('meetings', JSON.stringify(remainingItems));
  }
}
