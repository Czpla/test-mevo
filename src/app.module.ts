import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProcessFileService } from './process-file.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ProcessFileService],
})
export class AppModule {}
