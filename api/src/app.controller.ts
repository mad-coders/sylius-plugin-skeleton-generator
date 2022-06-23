import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/gitclone')
  async gitClone(): Promise<string> {
    await this.appService.gitClone('https://github.com/Sylius/PluginSkeleton/archive/refs/tags/v1.11.0.zip');

    return "";
  }

  @Get('/processTheme')
  async processTheme(): Promise<string> {
    await this.appService.applyChanges();

    return "";
  }
}
