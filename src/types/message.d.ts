export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSQL?: boolean; // optional flag for AI messages with raw SQL
}
