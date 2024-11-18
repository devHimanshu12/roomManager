import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in with correct credentials', () => {
    const result = service.login('user', 'Password123');
    expect(result).toBeTrue();
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(localStorage.getItem('loggedInUser')).toBe('user');
  });

  it('should not log in with incorrect credentials', () => {
    const result = service.login('user', 'wrongPassword');
    expect(result).toBeFalse();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('loggedInUser')).toBeNull();
  });

  it('should log out the user', () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', 'user');
    service.logout();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('loggedInUser')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

    it('should return true if the user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if the user is not logged in', () => {
    localStorage.removeItem('isLoggedIn');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return the current user', () => {
    localStorage.setItem('loggedInUser', 'user');
    expect(service.getCurrentUser()).toBe('user');
  });

  it('should return null if no user is logged in', () => {
    localStorage.removeItem('loggedInUser');
    expect(service.getCurrentUser()).toBeNull();
  });
});
