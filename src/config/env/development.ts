import { EnvironmentType } from "@t/Environment";

function getConfig(): EnvironmentType {
  return {
    env: 'development',
    uiUrl: 'http://localhost:4200',
    disconnectAfterSeconds: 120,
    socketPort: 3001,
  };
}


export default getConfig();
