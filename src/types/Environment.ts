export interface EnvironmentType {
  env: 'development'|'production'|'test';
  uiUrl: string;
  disconnectAfterSeconds: number;
  socketPort: number,

  redis: {
    host: string;
    port: number;
  },
}