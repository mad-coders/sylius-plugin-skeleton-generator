import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as Fs from 'fs';
import * as Path from 'path';
import { ProcessorService } from "./processor.service";

@Injectable()
export class AppService {


  constructor(private readonly processorService : ProcessorService) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  async gitClone(repoUrl: string) {
    const writePath = Path.resolve(__dirname, '../', 'data', 'plugin.zip');
    const writer = Fs.createWriteStream(writePath);
    const response = await Axios.request({
      url: repoUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  async applyChanges() {
    const sourcePath = Path.resolve(__dirname, '../', 'data', 'plugin.zip');
    const destPath = Path.resolve(__dirname, '../', 'data', 'plugin_dest.zip');

    this.processorService.process(sourcePath, destPath);
  }

}
