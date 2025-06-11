import {
  IsString,
  IsNumber,
  IsUUID,
  IsObject,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovieDetailsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  poster_path: string;

  @ApiProperty()
  @IsString()
  release_date: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  vote_average?: number;
}

export class CreateSessionDto {
  @ApiProperty({ description: 'First user ID' })
  @IsUUID()
  @IsNotEmpty()
  user1_id: string;

  @ApiProperty({ description: 'Second user ID' })
  @IsUUID()
  @IsNotEmpty()
  user2_id: string;
}

export class MoviePreferenceDto {
  @ApiProperty({ description: 'UUID of the user making the preference' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'TMDb movie ID' })
  @IsNumber()
  movieId: number;

  @ApiPropertyOptional({ description: 'Additional movie details to store' })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MovieDetailsDto)
  movieDetails?: MovieDetailsDto;
}

export class MovieQueueDto {
  @ApiProperty({ description: 'Array of TMDb movie IDs', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  movieIds: number[];
}

export class MovieReactionDto {
  @ApiProperty({ description: 'TMDb movie ID' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;
}
