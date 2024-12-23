import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager } from 'typeorm';
import { Config } from 'src/config/configuration';
import { UploadAppConfig } from './dto/uploadConfig.dto';
import { AppConfigEntity } from './entity/appconfig.entity';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { AppType } from './enum/app-type.enum';
import { FaqEntity } from './entity/faq.entity';
import { ConfigDto } from "./dto/config.dto";
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class AppConfigService {
  private readonly logger = new CustomLogger(AppConfigService.name);
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
    private dataSource: DataSource,
  ) {}

  async saveConfig(
    config: UploadAppConfig,
    updatedBy: string,
  ): Promise<UploadAppConfig> {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    const body = { ...config, updatedBy };
    return await toolsRepository.save(body);
  }

  async saveConfigBackoffice(
      config: ConfigDto,
      updatedBy: string,
  ) {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    const entity = new AppConfigEntity();
    entity.updatedBy = updatedBy;
    entity.config = config.config;
    entity.name = config.name;
    entity.version = config.version;
    return await toolsRepository.save(entity);
  }


  async updateConfigBackOffice(
      config: ConfigDto,
      updatedBy: string,
  ): Promise<AppConfigEntity> {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    const entity = await toolsRepository.findOne({where: {id: config.id}});
    Object.assign(entity, config);
    entity.updatedBy = updatedBy;
    return await toolsRepository.save(entity);
  }

  async getAllConfigs() {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    return await toolsRepository.find();
  }

  private updateForceUpgrade(name: string, config: any, storeId?: string, appVersion?: string) {
    const upgradeVersion = "1.1.103";
    if(appVersion && storeId && name == 'mobile' && storeId == '10004') {
      if(this.isVersionGreaterOrEqual(upgradeVersion, appVersion)) {
        this.logger.log(this.asyncContext.get('traceId'), `Updated force upgrade to true`);
        config.config.FORCE_UPDATE = true;
        config.config.LATEST_APP_VERSION = "1.1.104"; // this is the version where we released dairy products
      } 
    }
  }


  async getConfig(name: string, appVersion?: string, storeId?: string) {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    let config = null;

    if (appVersion != null) {
      config = await toolsRepository.findOne({
        select: ['name', 'config'],
        where: { name: name, version: appVersion },
      });
    }

    if (config == null) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'getting default configs',
      );
      config = await toolsRepository.findOne({
        select: ['name', 'config'],
        where: { name, version: 'default' },
      });
    }

    if (!config) {
      throw new HttpException(
        { message: 'Config not found', code: 'config_not_found' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.updateForceUpgrade(name, config, storeId, appVersion);
    return { ...config, serverTS: new Date().toISOString() };
  }

  async getFaq(appType: string) {
    const toolsRepository = this.dataSource.getRepository(FaqEntity);
    return await toolsRepository.find({
      where: { is_active: true, app: appType },
    });
  }



  async getConfigBackoffice(name: string, appVersion?: string) {
    const toolsRepository = this.dataSource.getRepository(AppConfigEntity);
    let config = null;

    if (appVersion != null) {
      config = await toolsRepository.findOne({
        select: ['id','name', 'config','version'],
        where: { name: name, version: appVersion },
      });
    }

    if (!config) {
      throw new HttpException(
          { message: 'Config not found', code: 'config_not_found' },
          HttpStatus.NOT_FOUND,
      );
    }
    return config;
  }

  async updateSupportNumbers(number: string): Promise<string> {
    const result = await this.entityManager.query(
      `
      UPDATE tools.appconfigs
      SET config = jsonb_set(
          jsonb_set(
              jsonb_set(config::jsonb, '{WHATSAPP_NUMBER}', $1::jsonb),
              '{HELP_NUMBER}', $1::jsonb
          ),
          '{CALL_TO_ORDER_NUMBER}', $1::jsonb
      )
      WHERE name = 'mobile'
      RETURNING *
    `,
      [JSON.stringify(number)]
    );
    if (result.length === 0) {
      throw new NotFoundException('No configuration found with the name "mobile".');
    }
    return number;
  }

  private isVersionGreaterOrEqual(version1: string, version2: string): boolean {
    if (version1 == null || version2 == null) {
      return false;
    }
    const levels1 = version1.split('.');
    const levels2 = version2.split('.');
    
    const length = Math.max(levels1.length, levels2.length);
    for (let i = 0; i < length; i++) {
      const v1 = i < levels1.length ? parseInt(levels1[i], 10) : 0;
      const v2 = i < levels2.length ? parseInt(levels2[i], 10) : 0;
      if (v1 < v2) {
        return false;
      } else if (v1 > v2) {
        return true;
      }
    }
    return true;
  }
}
