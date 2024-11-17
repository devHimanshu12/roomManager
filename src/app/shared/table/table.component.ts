import { Component, Input } from '@angular/core';
import { Meeting } from '../../models/meeting';

export type MeetingTableHeader = {
  label:string;
  key:string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input({required:true}) items: Meeting[] = []; // List of meetings passed as input
  @Input({required:true}) displayColumns : MeetingTableHeader[] = []
  @Input() isAction:boolean =false;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Deletes a meeting from the list by ID.
   * @param id - Meeting ID to be deleted
   */
  deleteMeeting(selectedItem: Meeting): void {
    this.items = this.items.filter((item) => item.date !== selectedItem.date && item.to !== selectedItem.to && item.from !== selectedItem.from);
    localStorage.setItem('meetings', JSON.stringify(this.items));
    alert('Meeting deleted successfully.');
  }

}
