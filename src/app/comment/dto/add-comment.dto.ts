import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { COMMENT_TYPE } from 'src/shared/constants';

export class AddCommentDto {
  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsEnum(COMMENT_TYPE)
  ref: COMMENT_TYPE;

  @ApiProperty()
  @IsString()
  ref_id: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  comment: string;
}
