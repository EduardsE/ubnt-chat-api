import { EnvironmentType } from "@t/Environment";

function getConfig(): EnvironmentType {
  return {
    env: 'test',
    uiUrl: 'TBD',
    disconnectAfterSeconds: 120,
    socketPort: 3002,
  };
}


export default getConfig();
