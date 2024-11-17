import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_KEY = 'loggedInUser'
  private readonly AUTH_KEY = 'isLoggedIn'

  constructor(private router:Router) { }

   /**
   * Login the user by storing their credentials in local storage.
   * @param username - The username of the user
   * @param password - The password of the user (mocked for simplicity)
   */
  login(username:any,password:any){
    const mockPassword =  'Password123';
    if(password === mockPassword){
      localStorage.setItem(this.AUTH_KEY,'true')
      localStorage.setItem(this.USER_KEY,username)
      return true
    }
    return false;
  }

   /**
   * Logs the user out by clearing the authentication state.
   */
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

    /**
   * Check if the user is logged in.
   * @returns boolean - Authentication status
   */
    isLoggedIn(): boolean {
      return localStorage.getItem(this.AUTH_KEY) === 'true';
    }

  /**
   * Get the currently logged-in user's username.
   * @returns string | null - Username or null if not logged in
   */
  getCurrentUser():string | null{
    return localStorage.getItem(this.USER_KEY)
  }
}
