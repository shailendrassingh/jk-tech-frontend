import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentsComponent } from './documents.component';
import { DocumentService } from '../../core/services/document.service';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  let documentService: DocumentService;

  const mockDocumentService = {
    getDocuments: jest.fn().mockReturnValue(of([])),
    uploadDocument: jest.fn(),
    deleteDocument: jest.fn().mockReturnValue(of(undefined)),
    triggerIngestion: jest.fn().mockReturnValue(of({ message: 'Success' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule
      ],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsComponent ;
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the upload form', () => {
    expect(component.uploadForm).toBeDefined();
    expect(component.uploadForm.contains('title')).toBe(true);
  });

  it('should load documents on init', () => {
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  describe('onFileSelected', () => {
    it('should set the selectedFile property', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const mockEvent = { currentTarget: { files: [file] } } as unknown as Event;
      component.onFileSelected(mockEvent);
      expect(component.selectedFile).toEqual(file);
    });
  });

  describe('onUpload', () => {
    beforeEach(() => {
        mockDocumentService.uploadDocument.mockClear();
    });

    it('should not call uploadDocument if form is invalid', () => {
      component.onUpload();
      expect(documentService.uploadDocument).not.toHaveBeenCalled();
    });

    it('should call uploadDocument when form is valid and file is selected', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const uploadData = { title: 'Test Title', description: '' };
      mockDocumentService.uploadDocument.mockReturnValue(of(100)); // Simulate progress

      component.uploadForm.setValue(uploadData);
      component.selectedFile = file;
      component.onUpload();

      expect(documentService.uploadDocument).toHaveBeenCalledWith(file, uploadData.title, uploadData.description);
    });
  });

  describe('deleteDocument', () => {
    it('should call deleteDocument and reload documents', () => {
      const docId = '123';
      component.deleteDocument(docId);
      expect(documentService.deleteDocument).toHaveBeenCalledWith(docId);
      expect(documentService.getDocuments).toHaveBeenCalledTimes(2); // Called once on init, once on reload
    });
  });

  describe('triggerIngestion', () => {
    it('should call triggerIngestion', () => {
      const docId = '123';
      component.triggerIngestion(docId);
      expect(documentService.triggerIngestion).toHaveBeenCalledWith(docId);
    });
  });
});