// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private baseUrl = 'https://intelligentacademicadvisor.somee.com/api/chatbot';

  constructor(private http: HttpClient) { }

  ask(query: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/ask`, { query });
  }
}
