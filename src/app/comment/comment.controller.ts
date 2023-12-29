import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../authentication/guard/roles.guard';
import { VerifiedGuard } from '../authentication/guard/verified.guard';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';

@ApiTags('Comments Endpoints')
@Controller('comment')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //   @Get()
  //   findAll(@Req() req, @Query() query: PostListingDto) {
  //     return this.postService.findAll(
  //       req.user.id,
  //       query,
  //       VIEW_PROFILE_TYPE.OWNER,
  //     );
  //   }

  @Post()
  create(@Req() req, @Body() addCommentDto: AddCommentDto) {
    return this.commentService.addComment(req.user, addCommentDto);
  }

  @Put(':id/like')
  like(@Req() req, @Param('id') id: string) {
    return this.commentService.likeComment(req.user, id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(VerifiedGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.commentService.removeComment(req.user, id);
  }
}
