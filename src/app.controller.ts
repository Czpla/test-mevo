import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProcessFileService } from './process-file.service';
import * as multer from 'multer';

@Controller('prescriptions')
export class AppController {
  constructor(private readonly processFileService: ProcessFileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.processFileService.execute(file.buffer);
  }
}
