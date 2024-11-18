import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { LayoutService } from '../../services/layout.service';
import { MeetingsService } from '../../services/meetings.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { Meeting } from '../../models/meeting';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockMeetingsService: jasmine.SpyObj<MeetingsService>;
  let mockLayoutService: jasmine.SpyObj<LayoutService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;

  beforeEach(async () => {
    mockMeetingsService = jasmine.createSpyObj('MeetingsService', ['fetchMeetings', 'deleteMeeting']);
    mockLayoutService = jasmine.createSpyObj('LayoutService', ['getSmallDevice']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);

    await TestBed.configureTestingModule({
     imports: [DashboardComponent, MatDialogModule, MatBottomSheetModule],
      providers: [
        { provide: MeetingsService, useValue: mockMeetingsService },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatBottomSheet, useValue: mockBottomSheet },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch meetings on initialization', () => {
    mockMeetingsService.fetchMeetings.and.returnValue([]);
    component.ngOnInit();
    expect(mockMeetingsService.fetchMeetings).toHaveBeenCalled();
    expect(component.upcomingMeetings).toEqual([]);
  });

  it('should filter meetings by room', () => {
    const mockMeetings = [
      { id: '1', room: '1', date: '2024-11-18', from: '10:00', to: '11:00',username:'user1',agenda:'agenda1' },
      { id: '2', room: '2', date: '2024-11-18', from: '12:00', to: '13:00',username:'user2',agenda:'agenda2' },
    ];
    mockMeetingsService.fetchMeetings.and.returnValue(mockMeetings);
    component.selectedRoom = 1;
    component.filterMeetingsByRoom();
    expect(component.filteredMeetings.length).toBe(1);
    expect(component.filteredMeetings[0].room).toBe('1');
  });

  it('should call deleteMeeting from the service when handleDelete is called', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockMeeting = { id: '1', room: '1', date: '2024-11-18', from: '10:00', to: '11:00',username:'user1',agenda:'agenda1' }
    component.handleDelete(mockMeeting);
    expect(mockMeetingsService.deleteMeeting).toHaveBeenCalledWith(mockMeeting);
  });
});
