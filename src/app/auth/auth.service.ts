import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router:Router) { }

  login(username:any,password:any){
    const mockPassword =  'Password123';
    if(password === mockPassword){
      return true
    }else{
      return false;
    }
  }

  logout(): void {
    // localStorage.removeItem(this.AUTH_KEY);
    // localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
}
