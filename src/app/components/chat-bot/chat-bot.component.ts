// src/app/components/chat-bot/chat-bot.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatbotService, ChatResponse } from '../../services/chatbot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  userQuery = '';
  chatHistory: { type: 'user' | 'bot'; message: string }[] = [];

  constructor(private chatService: ChatbotService) {}

  ngOnInit() {
    // optionally seed a welcome message
    this.chatHistory.push({ type: 'bot', message: 'Welcome! Ask me about the university bylaws.' });
  }

  submitQuery() {
    const q = this.userQuery.trim();
    if (!q) return;

    // add user message
    this.chatHistory.push({ type: 'user', message: q });
    this.userQuery = '';

    // call service
    this.chatService.ask(q).subscribe({
      next: (resp: ChatResponse) => {
        this.chatHistory.push({ type: 'bot', message: resp.message });
      },
      error: err => {
        console.error('Chatbot error', err);
        this.chatHistory.push({ type: 'bot', message: 'Sorry, something went wrong.' });
      }
    });
  }
}
