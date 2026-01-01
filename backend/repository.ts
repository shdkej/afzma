import { ChatHistory, Message } from './entity';

// In-memory store for demo purposes
// In a real app, this would be a database connection.
class ChatRepository {
  private chats: Map<string, ChatHistory> = new Map();

  async saveChat(chat: ChatHistory): Promise<ChatHistory> {
    this.chats.set(chat.id, { ...chat, updatedAt: Date.now() });
    return chat;
  }

  async getChatById(id: string): Promise<ChatHistory | null> {
    return this.chats.get(id) || null;
  }

  async getAllChats(): Promise<ChatHistory[]> {
    return Array.from(this.chats.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async addMessage(chatId: string, message: Message): Promise<ChatHistory | null> {
    const chat = this.chats.get(chatId);
    if (!chat) return null;

    chat.messages.push(message);
    chat.updatedAt = Date.now();
    return chat;
  }
}

// Global singleton
export const chatRepository = new ChatRepository();
