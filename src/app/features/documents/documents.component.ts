import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AppDocument, DocumentService } from '../../core/services/document.service';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  documents$: Observable<AppDocument[]> = of([]); // Use the new name

  constructor(
    private fb: FormBuilder,
     private dialog: MatDialog,
    private documentService: DocumentService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documents$ = this.documentService.getDocuments();
  }
  // Open Modal
  openUploadModal() {
    const dialogRef = this.dialog.open(UploadDocumentComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDocuments(); // refresh list after successful upload
      }
    });
  }

  deleteDocument(id: string): void {
    this.documentService.deleteDocument(id).subscribe(() => {
      this.loadDocuments();
    });
  }

  triggerIngestion(id: string): void {
    this.documentService.triggerIngestion(id).subscribe(response => {
      // Handle success (e.g., show a snackbar notification)
      console.log('Ingestion triggered:', response.message);
    });
  }
}
