export interface User {
  username: string;
  connectedAt: Date;
  socketId: string;
  color: string;
  lastActivityAt: Date;
}