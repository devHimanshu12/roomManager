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

  handleDelete(selectedItem:Meeting){
    this.emitDeletedItem.emit(selectedItem)
  }

}
