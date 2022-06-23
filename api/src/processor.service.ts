import {Injectable} from '@nestjs/common';
import * as AdmZip from 'adm-zip'
import {ProcessorsPipeline} from "./processorsPipeline.service";

@Injectable()
export class ProcessorService {
    private static readonly ENCODING = 'utf8';
    private static readonly DESCRIPTION = 'Created by Sylius Plugin Skeleton Generator';

    constructor(private readonly processorsPipeline: ProcessorsPipeline) {}

    process(sourcePath: string, destPath: string): void {
        const srcZip = new AdmZip(sourcePath);
        const destZip = new AdmZip();

        const srcEntries = srcZip.getEntries();
        srcEntries.forEach((entry) => {
            const context = this.processorsPipeline.process(entry.entryName, entry.getData().toString(ProcessorService.ENCODING));
            destZip.addFile(context.entryName, Buffer.from(context.contents, ProcessorService.ENCODING), ProcessorService.DESCRIPTION);
        });

        destZip.writeZip(destPath);
    }
}
