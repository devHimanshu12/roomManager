import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDialogComponent } from './status-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MeetingsService } from '../../services/meetings.service';
import { CommonModule } from '@angular/common';

describe('StatusDialogComponent', () => {
  let component: StatusDialogComponent;
  let fixture: ComponentFixture<StatusDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<StatusDialogComponent>>;
  let mockMeetingsService: jasmine.SpyObj<MeetingsService>;

  const mockDialogData = {
    date: '2024-11-18',
    fromTime: '10:00',
    toTime: '12:00',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMeetingsService = jasmine.createSpyObj('MeetingsService', [
      'fetchAvailableRooms',
      'fetchMeetings',
      'rooms',
    ]);

    mockMeetingsService.rooms = [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' },
    ];
    mockMeetingsService.fetchAvailableRooms.and.returnValue([
      { id: 1, name: 'Room 1' },
    ]);
    mockMeetingsService.fetchMeetings.and.returnValue([
      {
        id: '1',
        room: '1',
        date: '2024-11-18',
        from: '09:00',
        to: '11:00',
        username: 'John Doe',
        agenda:'agenda test'
      },
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, StatusDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MeetingsService, useValue: mockMeetingsService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize room statuses on ngOnInit', () => {
    spyOn(component, 'updateRoomStatuses');
    component.ngOnInit();
    expect(component.updateRoomStatuses).toHaveBeenCalled();
  });


  it('should check time overlap correctly', () => {
    expect(component['checkTimeOverlap']('10:00', '12:00', '09:00', '11:00')).toBeTrue();
    expect(component['checkTimeOverlap']('10:00', '12:00', '12:00', '13:00')).toBeFalse();
  });

  it('should close the dialog and send updated room statuses', () => {
    component.rooms = [{ id: 1, name: 'Room A', status: 'Available' }];
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.rooms);
  });
});
