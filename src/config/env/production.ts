import { EnvironmentType } from "@t/Environment";

function getConfig(): EnvironmentType {
  return {
    env: 'production',
    uiUrl: 'http://ec2-18-224-58-172.us-east-2.compute.amazonaws.com',
    disconnectAfterSeconds: 120,
    socketPort: 3001,
  };
}

export default getConfig();
