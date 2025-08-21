import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean;
  roles = ['ADMIN', 'EDITOR', 'VIEWER']; // Available roles

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.isEditMode = !!data.user;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.user?.name || '', [Validators.required]],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      // Password is only required when creating a new user
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      roles: [this.data.user?.roles || ['VIEWER'], [Validators.required]]
    });

    if (this.isEditMode) {
      this.form.get('email')?.disable(); // Don't allow email to be changed in edit mode
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue()); // Use getRawValue to include disabled fields
    }
  }
}
