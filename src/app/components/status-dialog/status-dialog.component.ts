import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MeetingsService } from '../../services/meetings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-dialog.component.html',
  styleUrl: './status-dialog.component.scss'
})
export class StatusDialogComponent {
  rooms: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit(): void {
    this.updateRoomStatuses();
  }

  /**
   * Updates room statuses based on the selected date and time.
   */
  updateRoomStatuses(): void {
    const { date, fromTime, toTime } = this.data;

    const availableRooms = this.meetingsService.fetchAvailableRooms(date, fromTime, toTime);
    const allMeetings = this.meetingsService.fetchMeetings();

    this.rooms = this.meetingsService.rooms.map((room) => {
      console.log(room);

      const currentMeeting = allMeetings.find(
        (meeting) =>
          meeting.room === room.id.toString() &&
          meeting.date === date &&
          this.checkTimeOverlap(fromTime, toTime, meeting.from, meeting.to)
      );

      if (currentMeeting) {
        return {
          ...room,
          status: 'In-Use',
          username: currentMeeting.username,
          currentMeeting: `${currentMeeting.from} - ${currentMeeting.to}`,
        };
      } else if (!availableRooms.some((availableRoom) => availableRoom.id === room.id)) {
        return { ...room, status: 'Booked', username: null, currentMeeting: null };
      } else {
        return { ...room, status: 'Available', username: null, currentMeeting: null };
      }
    });
  }

  /**
   * Checks if two time ranges overlap.
   */
  private checkTimeOverlap(from1: string, to1: string, from2: string, to2: string): boolean {
    const start1 = new Date(`1970-01-01T${from1}`);
    const end1 = new Date(`1970-01-01T${to1}`);
    const start2 = new Date(`1970-01-01T${from2}`);
    const end2 = new Date(`1970-01-01T${to2}`);

    return start1 < end2 && end1 > start2;
  }

  /**
   * Closes the dialog and sends the updated room statuses back to the parent component.
   */
  closeDialog(): void {
    this.dialogRef.close(this.rooms);
  }
}
