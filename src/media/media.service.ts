import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';
import { UploadMediaDto } from './dto/uploadMedia.dto';
import { S3Service } from './s3.service';
import { v4 } from 'uuid';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Injectable()
export class MediaService {
  private readonly logger = new CustomLogger(MediaService.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
    private s3Service: S3Service,
  ) {}

  async uploadAsset(media: UploadMediaDto, uploadedBy: string, type: string) {
    //TODO:: Add Logs
    const nameArray = media.resourceName.split('.');
    const ext = nameArray[nameArray.length - 1];
    const name = `${v4()}.${ext}`;
    this.logger.log(
      this.asyncContext.get('traceId'),
      `uploading ${media.resourceName}  as ${name} for ${uploadedBy} type ${type}`,
    );
    const uri = await this.s3Service.generateUploadSignedUrl(name, type);
    return { uri, name };
  }

  async getAssetUri(type: string, name: string) {
    if (type === 'public')
      return {
        uri: `${this.configService.get('s3CloudFrontBaseUrl')}/${type}/${name}`,
      };
    if (type === 'private')
      return {
        uri: await this.s3Service.generateDownloadSignedUrl(name, type),
      };
    return {};
  }
}
