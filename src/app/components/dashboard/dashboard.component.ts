import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LayoutService } from '../../services/layout.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ROOMS } from '../../data';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  rooms = ROOMS
  @ViewChild('bookingFormTemplate') bookingTemplate!:TemplateRef<any>;
  isSmallDevice:boolean = false;
  meetingForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private layoutService:LayoutService
  ){
    this.isSmallDevice = this.layoutService.getSmallDevice()
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  handleDialog(){
    const config = {
      width: this.isSmallDevice ? '100vw' : '60vw',
      maxWidth:'none',
    }
    this.isSmallDevice ? this.bottomSheet.open(this.bookingTemplate) : this.dialog.open(this.bookingTemplate,config)
  }

  /**
   * Initializes the meeting form with validators
   */
  private initializeForm(): void {
    this.meetingForm = this.fb.group({
      username: ['', Validators.required],
      room: ['', Validators.required],
      date: ['', Validators.required],
      from: ['', [Validators.required, this.validateTime]],
      to: ['', [Validators.required, this.validateTime]],
      agenda: ['', Validators.required],
    });
  }

  /**
   * Custom time validation to ensure the time format is correct
   * @param control - FormControl for the time input
   * @returns Validation error or null
   */
  private validateTime(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (value && !timePattern.test(value)) {
      return { invalidTime: true };
    }
    return null;
  }

  /**
   * Handles the form submission and logs the form data
   */
  onSubmit(): void {
    if (this.meetingForm.valid) {
      const meetingDetails = this.meetingForm.value;
      console.log('Meeting Booked:', meetingDetails);

      // Save to local storage or pass to a service
      const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
      meetings.push(meetingDetails);
      localStorage.setItem('meetings', JSON.stringify(meetings));

      // Reset the form after successful submission
      this.meetingForm.reset();
      alert('Meeting successfully booked!');
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  handleSearchRoom(){
    
  }

}
