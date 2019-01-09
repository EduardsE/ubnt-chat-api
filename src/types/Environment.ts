export interface EnvironmentType {
  env: 'development'|'production'|'test';
  uiUrl: string;

  redis: {
    host: string;
    port: number;
  },
}
