import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  // Mock AuthService
  const mockAuthService = {
    login: jest.fn()
  };

  // Mock Router
  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password fields', () => {
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should make the email field required and a valid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);
    emailControl?.setValue('not-an-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should make the password field required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      mockAuthService.login.mockClear();
    });

    it('should not call authService.login if the form is invalid', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login when the form is valid', () => {
      mockAuthService.login.mockReturnValue(of({ access_token: 'test-token' }));
      component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
      component.onSubmit();
      expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });

    it('should set the error message on failed login', () => {
      mockAuthService.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));
      component.loginForm.setValue({ email: 'wrong@example.com', password: 'wrongpassword' });
      component.onSubmit();
      expect(component.error).toBe('Invalid email or password. Please try again.');
    });
  });
});