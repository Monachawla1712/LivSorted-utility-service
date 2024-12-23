import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/configuration';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as mimeTypes from 'mime-types';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Injectable()
export class S3Service {
  private readonly logger = new CustomLogger(S3Service.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
  ) {}

  getClient() {
    return new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: this.configService.get<string>('s3AccessKey'),
        secretAccessKey: this.configService.get<string>('s3SecretAccessKey'),
      },
    });
  }

  async generateUploadSignedUrl(name: string, type = 'private') {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('s3BucketName'),
      Key: `${type}/${name}`,
      ContentType: mimeTypes.lookup(name),
      Metadata: {
        'Content-Type': mimeTypes.lookup(name),
      },
    });
    return getSignedUrl(this.getClient(), command, {
      expiresIn: 3600,
    });
  }

  async generateDownloadSignedUrl(name: string, type = 'private') {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('s3BucketName'),
      Key: `${type}/${name}`,
    });
    return getSignedUrl(this.getClient(), command, {
      expiresIn: 3600,
    });
  }

  //async generatePublicCdnUrl() {}
}
