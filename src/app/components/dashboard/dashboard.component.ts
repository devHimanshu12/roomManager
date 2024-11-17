import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// import services and component
import { LayoutService } from '../../services/layout.service';
import { BookMeetingComponent } from '../book-meeting/book-meeting.component';
import { TableComponent } from '../../shared/table/table.component';
import { displayBookingColumns, ROOMS } from '../../data';
import { Meeting } from '../../models/meeting';
import { FormsModule } from '@angular/forms';


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
  meetingColumns = displayBookingColumns
  upcomingMeetings:Meeting[]=[];
  selectedRoomMeetins:Meeting[]=[];
  rooms = ROOMS; // List of all rooms
  filteredMeetings: any[] = []; // Array to store filtered meetings
  selectedRoom: number = 1; // Selected room ID




  constructor(private dialog: MatDialog,
              private bottomSheet: MatBottomSheet,
              private layoutService:LayoutService){
    this.isSmallDevice = this.layoutService.getSmallDevice()
  }

  ngOnInit(): void {
    // const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    this.upcomingMeetings = this.fetchMeetings();
    this.filterMeetingsByRoom()
  }

  handleDialog(){
    const config = {
      width: this.isSmallDevice ? '100vw' : '60vw',
      maxWidth:'none',
    }
    if(this.isSmallDevice){
      this.bottomSheet.open(BookMeetingComponent)
    }else{
     const dialogRef = this.dialog.open(BookMeetingComponent,config)
     dialogRef.afterClosed().subscribe(()=>{
      this.upcomingMeetings = this.fetchMeetings();
     })
    }
  }


  /**
   * Fetch meetings from localStorage
   */
  fetchMeetings(): Meeting[] {
    const storedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    return storedMeetings
  }

   /**
   * Filters meetings by the selected room
   */
   filterMeetingsByRoom(): void {
    const meetings = this.fetchMeetings()
    if (this.selectedRoom) {
      this.filteredMeetings = meetings.filter(
        (meeting:Meeting) => +meeting.room == this.selectedRoom
      );
      console.log(this.selectedRoom,this.filteredMeetings,meetings);
    }

  }



}
