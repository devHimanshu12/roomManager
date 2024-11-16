export interface RoomStatus {
  room: string;
  status: 'Available' | 'In-Use' | 'Booked';
  user?: string;
  timeSlot?: string;
}
