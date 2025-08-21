import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// Rename the interface to avoid collision with the global Document type
export interface AppDocument {
  id: string;
  title: string;
  description?: string;
  filePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private docApiUrl = environment.documentApiUrl;
  private ingestionApiUrl = environment.ingestionApiUrl;

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<AppDocument[]> {
    return this.http.get<AppDocument[]>(this.docApiUrl);
  }

  uploadDocument(file: File, title: string, description: string): Observable<number | AppDocument> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post(`${this.docApiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              return Math.round(100 * (event.loaded / event.total));
            }
            return 0;
          case HttpEventType.Response:
            return event.body as AppDocument;
          default:
            return 0;
        }
      })
    );
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.docApiUrl}/${id}`);
  }

  triggerIngestion(documentId: string): Observable<any> {
    return this.http.post(`${this.ingestionApiUrl}/trigger`, { documentId });
  }
}