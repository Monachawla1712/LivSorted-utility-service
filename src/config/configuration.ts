import { EnvironmentVariables } from './env.validation';

export interface Config {
  appEnv: string;
  port: string;
  db_url: string;
  s3AccessKey: string;
  s3SecretAccessKey: string;
  s3BucketName: string;
  s3CloudFrontBaseUrl: string;
  googleMapApiKey: string;
  authServiceBaseUrl: string;
  storeServiceBaseUrl: string;
  orderServiceBaseUrl: string;
  internalToken: string;
  lithosBaseUrl: string;
  lithosKey: string;
  lithosUser: string;
}

export default (): Config => {
  const processEnv = process.env as unknown as EnvironmentVariables;
  return {
    appEnv: processEnv.ENV,
    port: processEnv.PORT || '3003',
    db_url: processEnv.DATABASE_URL,
    s3AccessKey: processEnv.S3_ACCESS_KEY || '',
    s3SecretAccessKey: processEnv.S3_SECRET_ACCESS_KEY || '',
    s3BucketName: processEnv.S3_BUCKET_NAME || '',
    s3CloudFrontBaseUrl: processEnv.S3_CLOUDFRONT_BASE_URL,
    googleMapApiKey: processEnv.GOOGLE_MAPS_API_KEY,
    authServiceBaseUrl: processEnv.AUTH_SERVICE_BASE_URL,
    storeServiceBaseUrl: processEnv.STORE_SERVICE_BASE_URL,
    orderServiceBaseUrl: processEnv.ORDER_SERVICE_BASE_URL,
    internalToken: processEnv.INTERNAL_TOKEN,
    lithosBaseUrl: processEnv.LITHOS_BASE_URL,
    lithosKey: processEnv.LITHOS_KEY,
    lithosUser: processEnv.LITHOS_USER,
  };
};
