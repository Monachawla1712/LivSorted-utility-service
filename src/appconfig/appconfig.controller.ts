import {
  Body,
  Controller,
  Post,
  UseFilters,
  Get,
  Headers,
  Param,
  UsePipes,
  HttpException,
  HttpStatus, Put,
  NotFoundException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';
import { AppConfigService } from './appconfig.service';
import { WhitelistErrorValidation } from '../common/validation.pipeline';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { AppType, appTypeFromAppId } from './enum/app-type.enum';
import {UploadAppConfig} from "./dto/uploadConfig.dto";
import {ConfigDto} from "./dto/config.dto";

@Controller('config')
@ApiTags('App Configs')
@UseFilters(HttpExceptionFilter)
@UsePipes(WhitelistErrorValidation)
export class AppConfigController {
  private readonly logger = new CustomLogger(AppConfigController.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private appConfigService: AppConfigService,
  ) {}

  @ApiBody({ type: UploadAppConfig })
  @Post()
  uploadAsset(
    @Body() config: UploadAppConfig,
    @Headers('userId') updatedBy: string,
  ) {
    return this.appConfigService.saveConfig(config, updatedBy);
  }

  @ApiBody({ type: ConfigDto })
  @Post('backoffice')
  uploadConfigBackoffice(
      @Body() config: ConfigDto,
      @Headers('userId') updatedBy: string,
  ) {
    return this.appConfigService.saveConfigBackoffice(config, updatedBy);
  }

  @ApiBody({type: ConfigDto})
  @Put('backoffice')
  updateConfig(
      @Body() config: ConfigDto,
      @Headers('userId') updatedBy: string,
  ) {
    return this.appConfigService.updateConfigBackOffice(config, updatedBy);
  }

  @Get()
  getAllAppConfigs() {
    return this.appConfigService.getAllConfigs();
  }

  @Get('get/backoffice/:name')
  getAppConfigBackOffice(
      @Headers('appVersion') appVersion: string = null,
      @Param('name') name: string,
  ) {
    this.logger.log(this.asyncContext.get('traceId'), appVersion);
    return this.appConfigService.getConfigBackoffice(name, appVersion);
  }

  @Get('get/:name')
  getAppConfig(
    @Headers('appVersion') appVersion: string = null,
    @Headers('storeId') storeId: string = null,
    @Param('name') name: string,
  ) {
    this.logger.log(this.asyncContext.get('traceId'), appVersion);
    return this.appConfigService.getConfig(name, appVersion, storeId);
  }

  @Get('faq')
  getFaq(@Headers('appId') appId: string = null) {
    let appType: string = null;
    if (appId != null) {
      if (appId == AppType.CONSUMER) {
        appType = 'CONSUMER';
      }
    } else {
      throw new HttpException(
        {
          message: 'App Id not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.appConfigService.getFaq(appType);
  }

  @Put('update-phone/:number')
  async updateSupportNumbers(
    @Param('number') number: string,
    @Headers('userId') updatedBy: string,
  ): Promise<{ number: string }> {
    const updatedNumber = await this.appConfigService.updateSupportNumbers(number);
    if (!updatedNumber) {
      throw new NotFoundException('Failed to update contact numbers.');
    }
    this.logger.log(
      this.asyncContext.get('traceId'),
      `Support contact number updated by: ${updatedBy}`
    );
    return { number: updatedNumber };
  }
}
