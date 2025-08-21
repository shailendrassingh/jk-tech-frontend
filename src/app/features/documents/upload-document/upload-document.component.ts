import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppDocument, DocumentService } from '../../../core/services/document.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss',
  imports: [CommonModule, FormsModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatProgressBarModule],
})
export class UploadDocumentComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  documents$: Observable<AppDocument[]> = of([]); // Use the new name

  constructor(
    private documentService: DocumentService,
     private fb: FormBuilder,
    private dialogRef: MatDialogRef<UploadDocumentComponent>
  ) {
        this.uploadForm = this.fb.group({
          title: ['', Validators.required],
          description: ['']
        });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onUpload(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const { title, description } = this.uploadForm.value;
      this.uploadProgress = 0;

      this.documentService.uploadDocument(this.selectedFile, title, description).subscribe(event => {
        if (typeof event === 'number') {
          this.uploadProgress = event;
        } else {
          // Upload complete
          this.uploadProgress = null;
          this.selectedFile = null;
          this.uploadForm.reset();
          this.dialogRef.close(true);
        }
      });
    }
  }

}



