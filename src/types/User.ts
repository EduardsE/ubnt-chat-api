export interface User {
  username: string;
  connectedAt: Date;
  color: string;
  socketId?: string;
  lastActivityAt?: Date;
  disconnectDueToInactivity?: boolean;
}
