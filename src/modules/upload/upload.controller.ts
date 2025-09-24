import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './services/upload.service';
import * as multer from 'multer';
import { GetByIdService } from './services/get-by-id.service';

@Controller('prescriptions')
export class UploadController {
  constructor(
    private readonly _uploadService: UploadService,
    private readonly _getByIdService: GetByIdService,
  ) {}

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
    return this._uploadService.execute(file);
  }

  @Get('upload/:id')
  getUploadStatus(@Param('id') uploadId: string) {
    return this._getByIdService.execute(uploadId);
  }
}
