import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MurmursModule } from '../murmurs/murmurs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MurmursModule, UsersModule],
  controllers: [MeController],
})
export class MeModule {}
