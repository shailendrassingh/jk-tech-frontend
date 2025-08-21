import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { QaComponent } from './qa.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentService } from '../../core/services/document.service';
import { QaService } from '../../core/services/qa.service';

// Mock services
const mockDocumentService = {
  getDocuments: () => of([{ id: '1', title: 'Test Doc', filePath: 'path' }])
};

const mockQaService = {
  askQuestion: jest.fn()
};

describe('QaComponent', () => {
  let component: QaComponent;
  let fixture: ComponentFixture<QaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaComponent ],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatListModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: QaService, useValue: mockQaService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with a question control', () => {
    expect(component.qaForm.contains('question')).toBe(true);
  });

  it('should load documents on init', () => {
    component.documents$.subscribe(docs => {
      expect(docs.length).toBe(1);
      expect(docs[0].title).toBe('Test Doc');
    });
  });

  describe('onDocSelectionChange', () => {
    it('should add a doc ID to selectedDocIds when checked', () => {
      component.onDocSelectionChange({ checked: true }, 'doc1');
      expect(component.selectedDocIds).toContain('doc1');
    });

    it('should remove a doc ID from selectedDocIds when unchecked', () => {
      component.selectedDocIds = ['doc1', 'doc2'];
      component.onDocSelectionChange({ checked: false }, 'doc1');
      expect(component.selectedDocIds).not.toContain('doc1');
      expect(component.selectedDocIds).toContain('doc2');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Reset mock before each test in this describe block
      mockQaService.askQuestion.mockClear();
    });

    it('should not call QaService if form is invalid', () => {
      component.onSubmit();
      expect(mockQaService.askQuestion).not.toHaveBeenCalled();
    });

    it('should call QaService and set the answer on success', () => {
      const question = 'What is the test?';
      const mockResponse = { answer: 'This is a test.' };
      mockQaService.askQuestion.mockReturnValue(of(mockResponse));

      component.qaForm.setValue({ question });
      component.onSubmit();

      expect(mockQaService.askQuestion).toHaveBeenCalledWith(question, []);
      expect(component.isLoading).toBe(false);
      expect(component.answer).toBe(mockResponse.answer);
    });

    it('should handle errors from QaService', () => {
      const question = 'What is the test?';
      mockQaService.askQuestion.mockReturnValue(throwError(() => new Error('API Error')));

      component.qaForm.setValue({ question });
      component.onSubmit();

      expect(mockQaService.askQuestion).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.answer).toContain('error occurred');
    });
  });
});
