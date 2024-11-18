import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService:jasmine.SpyObj<AuthService>;
  let router:jasmine.SpyObj<Router>

  beforeEach(async () => {

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent,ReactiveFormsModule],
      providers:[
        {provide:AuthService,useValue:authServiceSpy},
        {provide:Router,useValue:routerSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.handleTogglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('should navigate to dashboard on successful login', () => {
    authService.login.and.returnValue(true);
    component.loginForm.setValue({ username: 'testuser', password: 'Password123' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('testuser', 'Password123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show an alert on failed login', () => {
    spyOn(window, 'alert');
    authService.login.and.returnValue(false);
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpass' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('testuser', 'wrongpass');
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should disable the login button if the form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });
});
