import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MeetingsService } from '../../services/meetings.service';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-book-meeting',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './book-meeting.component.html',
  styleUrl: './book-meeting.component.scss'
})
export class BookMeetingComponent implements OnInit {

  meetingForm!: FormGroup;
  isSearchRoomClicked:boolean = false;
  minDate!:string;
  currentTime!:string;
  availableRooms:any[]=[];
  rooms: any[] = [];
  showStatusDialog:boolean = false;

  constructor(private fb: FormBuilder,private authService:AuthService,
    private layoutService:LayoutService,
    private dialog:MatDialog,
    @Optional() public dialogRef: MatDialogRef<BookMeetingComponent>,
    @Optional() public bottomSheetRef:MatBottomSheetRef<BookMeetingComponent>,
    private meetingService:MeetingsService
  ){


    const today = new Date();
    // to disable previous date in date picker input
    this.minDate = today.toISOString().split('T')[0]
    this.currentTime = today.getTime().toString()

  }

  ngOnInit(): void {
    this.initializeForm();
    this.rooms = this.meetingService.rooms.map((room) => ({
      ...room,
      status: 'Available',
      user: null,
      currentMeeting: null,
    }));
  }

  /**
   * Initializes the meeting form with validators
   */
  private initializeForm(): void {
    this.meetingForm = this.fb.group({
      username: '',
      room: ['', Validators.required],
      date: ['', Validators.required],
      from: ['', [Validators.required,this.validateTimeRange.bind(this)]],
      to: ['', [Validators.required, this.validateTimeRange.bind(this)]],
      agenda: ['', Validators.required],
    });

    const currentUser = this.authService.getCurrentUser()
    this.meetingForm.patchValue({username:currentUser})
  }

   /**
   * Custom time range validation to ensure the time is between 09:00 and 18:00
   * @param control - FormControl for the time input
   * @returns Validation error or null
   */
   private validateTimeRange(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const [hour, minute] = value.split(':').map(Number);
    const isBeforeMinTime = hour < 9 || (hour === 9 && minute < 0);
    const isAfterMaxTime = hour > 18 || (hour === 18 && minute > 0);

    if (isBeforeMinTime || isAfterMaxTime) {
      return { timeOutOfRange: true };
    }
    return null;
  }

    /**
   * Handles time validation between "from" and "to" fields
   */
    private validateFromToTime(): boolean {
      const from = this.meetingForm.get('from')?.value;
      const to = this.meetingForm.get('to')?.value;

      if (!from || !to) return true;

      const [fromHour, fromMinute] = from.split(':').map(Number);
      const [toHour, toMinute] = to.split(':').map(Number);

      const fromTime = fromHour * 60 + fromMinute;
      const toTime = toHour * 60 + toMinute;

      return toTime - fromTime >= 30; // Minimum 30 minutes difference
    }

  /**
   * Handles the form submission and logs the form data
   */
  onSubmit(): void {
    if (!this.validateFromToTime()) {
      alert('The time range must be at least 30 minutes.');
      return;
    }

    if (this.meetingForm.valid) {
      const meetingDetails = this.meetingForm.value;
      meetingDetails.id = this.generateUniqueId()
      console.log('Meeting Booked:', meetingDetails);

      // Save to local storage or pass to a service
      const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
      meetings.push(meetingDetails);
      localStorage.setItem('meetings', JSON.stringify(meetings));

      // Reset the form after successful submission
      this.meetingForm.reset();
      this.dialogRef.close()
      alert('Meeting successfully booked!');
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  private generateUniqueId(): string {
    const timestamp = Date.now(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number
    return `${timestamp}-${randomNum}`; // Combine for uniqueness
  }


  handleSearchRoom(isSearchClicked:boolean){
    const x = new Date()
    const today = new Date(x.getFullYear(),x.getMonth(),x.getDate())
    const myDate = new Date(this.meetingForm.get('date')?.value)
    const currentTime = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
    const inputFromTime = this.meetingForm.get('from')?.value
    if(today.toDateString() === myDate.toDateString()){
      if(inputFromTime <= currentTime){
        alert('Please select time more than current time or select date other than today')
        return
      }
    }
    if (
      !this.meetingForm.get('date')?.value ||
      !this.meetingForm.get('from')?.value ||
      !this.meetingForm.get('to')?.value
    ) {
      alert('Please enter all the required fields');
      return;
    }

    if (
      this.meetingForm.get('date')?.invalid ||
      this.meetingForm.get('from')?.invalid ||
      this.meetingForm.get('to')?.invalid
    ) {
      alert('Please enter the date and time first and it should be between 9:00 AM to 6:00 PM');
      return;
    }

    if (!this.validateFromToTime()) {
      alert('The time range must be at least 30 minutes.');
      return;
    }

    this.showStatusDialog = true;
    const date = this.meetingForm.get('date')?.value;
    const fromTime = this.meetingForm.get('from')?.value;
    const toTime = this.meetingForm.get('to')?.value

    this.availableRooms = this.meetingService.fetchAvailableRooms(date,fromTime,toTime)
    this.isSearchRoomClicked = isSearchClicked;
  }

  checkStatus(){
    this.handleSearchRoom(false)
    if(this.showStatusDialog){
      const dialogRef = this.dialog.open(StatusDialogComponent, {
        width: this.layoutService.getSmallDevice() ? '100vw' : '60vw',
        maxWidth:'none',
        data: {
          date: this.meetingForm.get('date')?.value ,
          fromTime: this.meetingForm.get('from')?.value,
          toTime: this.meetingForm.get('to')?.value,
        },
      });

      dialogRef.afterClosed().subscribe((updatedRooms) => {
        if (updatedRooms) {
          this.rooms = updatedRooms;
        }
      });
    }
  }

  closeDialog(){
    if(this.layoutService.getSmallDevice()){
      this.bottomSheetRef.dismiss()
    }else{
      this.dialogRef.close()
    }
  }


}
