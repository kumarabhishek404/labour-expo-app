declare module 'react-native-in-app-updates' {
  export default class InAppUpdates {
    constructor(debug: boolean);
    checkNeedsUpdate(): Promise<{ shouldUpdate: boolean }>;
    startUpdate(options: { updateType: number }): Promise<void>;
    updateTypes: {
      FLEXIBLE: number;
      IMMEDIATE: number;
    };
  }
}