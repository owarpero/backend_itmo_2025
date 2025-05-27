import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty()
  @IsString()
  fromUserId: string;

  @ApiProperty()
  @IsString()
  toUserId: string;
}

export class FriendRequestIdDto {
  @ApiProperty()
  @IsString()
  requestId: string;
}

export class UserIdDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
