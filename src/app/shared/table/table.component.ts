import { Component, Input } from '@angular/core';
import { Meeting } from '../../models/meeting';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input() roomName!: string; // Name of the room passed as input
  @Input() meetings: Meeting[] = []; // List of meetings passed as input

  columns: string[] = ['username', 'date', 'time', 'agenda', 'actions'];

  constructor() {}

  ngOnInit(): void {}

  /**
   * Deletes a meeting from the list by ID.
   * @param id - Meeting ID to be deleted
   */
  deleteMeeting(id: string): void {
    this.meetings = this.meetings.filter((meeting) => meeting.id !== id);
    localStorage.setItem('meetings', JSON.stringify(this.meetings));
    alert('Meeting deleted successfully.');
  }

}
