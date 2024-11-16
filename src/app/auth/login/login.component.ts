import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.createLoginGroup()
  }

  createLoginGroup(){
    this.loginForm = new FormGroup({
      username:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required])
    })
  }

  ngOnInit(){
  }



  onSubmit() {
    if (this.authService.login(this.getUserName, this.getPassword)) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }

  get getUserName(){
    return this.loginForm.get('username')?.value
  }

  get getPassword(){
    return this.loginForm.get('password')?.value
  }


}
