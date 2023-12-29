import { Module } from '@nestjs/common';
import { MiscController } from './misc.controller';

@Module({
  controllers: [MiscController],
  imports: [],
  providers: [],
})
export class MiscModule {}
