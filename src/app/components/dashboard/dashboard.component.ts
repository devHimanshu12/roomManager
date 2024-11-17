import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';

// import services and component
import { HeaderComponent } from '../../shared/header/header.component';
import { LayoutService } from '../../services/layout.service';
import { BookMeetingComponent } from '../book-meeting/book-meeting.component';
import { TableComponent } from '../../shared/table/table.component';
import { displayBookingColumns, ROOMS } from '../../data';
import { Meeting } from '../../models/meeting';
import { MeetingsService } from '../../services/meetings.service';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,TableComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  isSmallDevice:boolean = false;
  meetings: Meeting[] = []; // Array to store meetings fetched from localStorage
  rooms:any[]=ROOMS
  meetingColumns = displayBookingColumns
  upcomingMeetings:Meeting[]=[];
  selectedRoomMeetins:Meeting[]=[];
  filteredMeetings: any[] = []; // Array to store filtered meetings
  selectedRoom: number = 1; // Selected room ID
  selectedDate: string = '';
  selectedFromTime: string = '';
  selectedToTime: string = '';


  constructor(private dialog: MatDialog,
              private bottomSheet: MatBottomSheet,
              private layoutService:LayoutService,
              private meetingService:MeetingsService){
    this.isSmallDevice = this.layoutService.getSmallDevice()
  }

  ngOnInit(): void {
    this.upcomingMeetings = this.meetingService.fetchMeetings()
    this.filterMeetingsByRoom()
  }

  handleDialog(){
    const config = {
      width: this.isSmallDevice ? '100vw' : '50vw',
      maxWidth:'none',
    }
    if(this.isSmallDevice){
      this.bottomSheet.open(BookMeetingComponent)
    }else{
     const dialogRef = this.dialog.open(BookMeetingComponent,config)
     dialogRef.afterClosed().subscribe(()=>{
      this.upcomingMeetings = this.meetingService.fetchMeetings()
      this.filterMeetingsByRoom()
     })
    }
  }



   /**
   * Filters meetings by the selected room
   */
   filterMeetingsByRoom(): void {
    const meetings = this.meetingService.fetchMeetings()
    if (this.selectedRoom) {
      this.filteredMeetings = meetings.filter(
        (meeting:Meeting) => +meeting.room == this.selectedRoom
      );
    }
  }

  handleDelete(deletedMeeting:Meeting){
    const confirmDelete = confirm('Are you sure you want to delete this meeting?');
    if(confirmDelete){
      this.meetingService.deleteMeeting(deletedMeeting)
      this.upcomingMeetings = this.meetingService.fetchMeetings()
      this.filterMeetingsByRoom()
    }
  }
}
