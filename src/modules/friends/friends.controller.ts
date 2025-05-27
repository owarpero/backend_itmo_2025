import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  FriendRequestDto,
  FriendRequestIdDto,
  UserIdDto,
} from './dto/friend.dto';
import { FriendRequest, Friendship } from 'entities';

@ApiTags('friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('requests/send')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Friend request already exists or users are already friends.',
  })
  async sendFriendRequest(
    @Body() friendRequestDto: FriendRequestDto,
  ): Promise<FriendRequest> {
    return this.friendsService.sendFriendRequest(
      friendRequestDto.fromUserId,
      friendRequestDto.toUserId,
    );
  }

  @Post('requests/:requestId/accept')
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Friend request accepted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Friend request not found.' })
  async acceptFriendRequest(
    @Param() params: FriendRequestIdDto,
  ): Promise<void> {
    await this.friendsService.acceptFriendRequest(params.requestId);
  }

  @Post('requests/:requestId/reject')
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Friend request rejected successfully.',
  })
  @ApiResponse({ status: 404, description: 'Friend request not found.' })
  async rejectFriendRequest(
    @Param() params: FriendRequestIdDto,
  ): Promise<void> {
    await this.friendsService.rejectFriendRequest(params.requestId);
  }

  @Get('requests/:userId')
  @ApiOperation({ summary: 'Get all friend requests for a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of friend requests.',
  })
  async getFriendRequests(
    @Param() params: UserIdDto,
  ): Promise<FriendRequest[]> {
    return this.friendsService.getFriendRequests(params.userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all friends for a user' })
  @ApiResponse({ status: 200, description: 'Returns the list of friends.' })
  async getFriends(@Param() params: UserIdDto): Promise<Friendship[]> {
    return this.friendsService.getFriends(params.userId);
  }

  @Delete(':userId/:friendId')
  @ApiOperation({ summary: 'Remove a friend' })
  @ApiResponse({ status: 200, description: 'Friend removed successfully.' })
  async removeFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    await this.friendsService.removeFriend(userId, friendId);
  }
}
