import { TestBed } from '@angular/core/testing';

import { MeetingsService } from './meetings.service';
import { Meeting } from '../models/meeting';

describe('MeetingsService', () => {
  let service: MeetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingsService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch meetings from local storage', () => {
    const mockMeetings = [
      { id: '1', room: '1', date: '2024-11-18', from: '10:00', to: '11:00',username:'user1',agenda:'agenda1' },
      { id: '2', room: '2', date: '2024-11-18', from: '12:00', to: '13:00',username:'user2',agenda:'agenda2' },
    ];
    localStorage.setItem('meetings', JSON.stringify(mockMeetings));
    const meetings = service.fetchMeetings();
    expect(meetings).toEqual(mockMeetings);
  });

  it('should fetch available rooms', () => {
    const mockMeetings = [
      { id: '1', room: '1', date: '2024-11-18', from: '10:00', to: '11:00',username:'user1',agenda:'agenda1' },
      { id: '2', room: '2', date: '2024-11-18', from: '12:00', to: '13:00',username:'user2',agenda:'agenda2' },
    ];
    localStorage.setItem('meetings', JSON.stringify(mockMeetings));
    const availableRooms = service.fetchAvailableRooms('2024-11-18', '09:00', '10:00');
    expect(availableRooms).toEqual(service.rooms);
  });

  it('should delete a meeting by ID', () => {
    const mockMeetings = [
      { id: '1', room: '1', date: '2024-11-18', from: '10:00', to: '11:00',username:'user1',agenda:'agenda1' },
      { id: '2', room: '2', date: '2024-11-18', from: '12:00', to: '13:00',username:'user2',agenda:'agenda2' },
    ];
    localStorage.setItem('meetings', JSON.stringify(mockMeetings));
    service.deleteMeeting(mockMeetings[0]);
    const remainingMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    expect(remainingMeetings.length).toBe(1);
    expect(remainingMeetings[0].id).toBe('2');
  });

});
