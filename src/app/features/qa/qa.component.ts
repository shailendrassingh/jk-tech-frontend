import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AppDocument, DocumentService } from '../../core/services/document.service';
import { QaService } from '../../core/services/qa.service';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent implements OnInit {
  qaForm: FormGroup;
  documents$: Observable<AppDocument[]> = of([]);
  selectedDocIds: string[] = [];
  isLoading = false;
  answer: string | null = null;
  
  documents: AppDocument[] = [];

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private qaService: QaService
  ) {
    this.qaForm = this.fb.group({
      question: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.documents$ = this.documentService.getDocuments();
  }

  onDocSelectionChange(event: any, docId: string): void {
    if (event.checked) {
      this.selectedDocIds.push(docId);
    } else {
      this.selectedDocIds = this.selectedDocIds.filter(id => id !== docId);
    }
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe((docs: any) => {
      this.documents = docs?.data || [];
    });
  }

  onSubmit(): void {
    if (this.qaForm.valid) {
      this.isLoading = true;
      this.answer = null;
      const { question } = this.qaForm.value;

      this.qaService.askQuestion(question, this.selectedDocIds).subscribe({
        next: (response) => {
          this.answer = response.answer;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error asking question:', err);
          this.answer = 'Sorry, an error occurred while fetching the answer.';
          this.isLoading = false;
        }
      });
    }
  }
}