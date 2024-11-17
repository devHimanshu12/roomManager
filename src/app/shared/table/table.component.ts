import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

// models importing
import { Meeting } from '../../models/meeting';

export type MeetingTableHeader = {
  label:string;
  key:string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input({required:true}) items: Meeting[] = []; // List of meetings passed as input
  @Input({required:true}) displayColumns : MeetingTableHeader[] = []
  @Input() isAction:boolean =false;
  @Output() emitDeletedItem = new EventEmitter<Meeting>()

  constructor() {}

  ngOnInit(): void {}

  // /**
  //  * Deletes a meeting from the list by ID.
  //  * @param id - Meeting ID to be deleted
  //  */
  // deleteMeeting(selectedItem: Meeting): void {
  //   this.items = this.items.filter((item) => item.date !== selectedItem.date && item.to !== selectedItem.to && item.from !== selectedItem.from);
  //   localStorage.setItem('meetings', JSON.stringify(this.items));
  //   alert('Meeting deleted successfully.');
  // }

  handleDelete(selectedItem:Meeting){
    this.emitDeletedItem.emit(selectedItem)
  }

}
