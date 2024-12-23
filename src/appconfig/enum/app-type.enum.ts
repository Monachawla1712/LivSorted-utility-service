export enum AppType {
  CONSUMER = 'com.sorted.consumerflutterapp',
  PARTNER = 'com.sorted.partnerflutterapp',
  FOS = 'com.sorted.fos',
}

export function appTypeFromAppId(appType: string): AppType | null {
  for (const value of Object.values(AppType)) {
    if (value === appType) {
      return value as AppType;
    }
  }
  return null;
}
