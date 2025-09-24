import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessFileService {
  execute(file: Buffer): string {
    return 'Hello World!';
  }
}
