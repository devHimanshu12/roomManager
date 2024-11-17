import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Input() pageTitle:string = 'Booking Manager'
  username!:string|null;


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  this.username = this.authService.getCurrentUser()
  }

  logout(){
    this.authService.logout()
  }

}
