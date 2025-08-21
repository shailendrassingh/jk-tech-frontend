import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the register form with name, email, and password fields', () => {
    expect(component.registerForm.contains('name')).toBe(true);
    expect(component.registerForm.contains('email')).toBe(true);
    expect(component.registerForm.contains('password')).toBe(true);
  });

  it('should make the password field have a minlength of 8', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('1234567');
    expect(passwordControl?.hasError('minlength')).toBe(true);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      mockAuthService.register.mockClear();
      mockRouter.navigate.mockClear();
    });

    it('should not call authService.register if the form is invalid', () => {
      component.onSubmit();
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should call authService.register and navigate to login on success', () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      mockAuthService.register.mockReturnValue(of({})); // Simulate successful registration

      component.registerForm.setValue(userData);
      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith(userData);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should set the error message on failed registration', () => {
      const errorResponse = { error: { message: 'Email already exists' } };
      mockAuthService.register.mockReturnValue(throwError(() => errorResponse));

      component.registerForm.setValue({ name: 'Test User', email: 'test@example.com', password: 'password123' });
      component.onSubmit();

      expect(component.error).toBe('Email already exists');
    });
  });
});