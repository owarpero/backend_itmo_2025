import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendRequest, Friendship } from 'entities';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, Friendship])],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
