import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface QAResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = environment.qaApiUrl; // URL to Python FastAPI service

  constructor(private http: HttpClient) { }

  askQuestion(question: string, documentIds: string[]): Observable<QAResponse> {
    return this.http.post<QAResponse>(this.apiUrl, { question, document_ids: documentIds });
  }
}
