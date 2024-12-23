import {
  Body,
  Controller,
  Post,
  UseFilters,
  Get,
  Headers,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';
import { UploadMediaDto } from './dto/uploadMedia.dto';
import { MediaService } from './media.service';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Controller('media')
@ApiTags('Media')
@UseFilters(HttpExceptionFilter)
export class MediaController {
  private readonly logger = new CustomLogger(MediaController.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private mediaService: MediaService,
  ) {}

  @ApiBody({ type: UploadMediaDto })
  @Post('/:type')
  uploadAsset(
    @Body() media: UploadMediaDto,
    @Headers('userId') uploadedBy: string,
    @Param('type') type: string,
  ) {
    return this.mediaService.uploadAsset(media, uploadedBy, type);
  }

  @Get('/:type/:name')
  getAsset(@Param('type') type: string, @Param('name') name: string) {
    return this.mediaService.getAssetUri(type, name);
  }

  @Get('internal/:type/:name')
  getInternalAsset(@Param('type') type: string, @Param('name') name: string) {
    return this.mediaService.getAssetUri(type, name);
  }
}
