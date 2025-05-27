import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'entities';
import { GroupsController } from 'modules/groups/groups.controller';
import { GroupsService } from 'modules/groups/groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
