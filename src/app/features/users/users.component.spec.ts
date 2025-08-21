import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersComponent } from './users.component';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;
  let dialog: MatDialog;

  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', roles: ['ADMIN'] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', roles: ['VIEWER'] },
  ];

  const mockUserService = {
    getUsers: jest.fn().mockReturnValue(of(mockUsers)),
    deleteUser: jest.fn().mockReturnValue(of(undefined)),
    createUser: jest.fn().mockReturnValue(of(mockUsers[0])),
    updateUser: jest.fn().mockReturnValue(of(mockUsers[0])),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(true) // Simulate dialog closing with a 'save' action
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should filter users correctly', () => {
    const event = { target: { value: 'john' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('john');
  });

  describe('openAddUserDialog', () => {
    it('should open a dialog and create a user on close', () => {
      component.openAddUserDialog();
      expect(dialog.open).toHaveBeenCalled();
      // Since afterClosed returns a truthy value in the mock, createUser should be called
      expect(userService.createUser).toHaveBeenCalled();
    });
  });

  describe('openEditUserDialog', () => {
    it('should open a dialog and update a user on close', () => {
      const userToEdit = mockUsers[0];
      component.openEditUserDialog(userToEdit);
      expect(dialog.open).toHaveBeenCalled();
      expect(userService.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser and reload users', () => {
      const userId = '1';
      component.deleteUser(userId);
      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
      // It's called once on init and once after deletion
      expect(userService.getUsers).toHaveBeenCalledTimes(2);
    });
  });
});
