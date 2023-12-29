import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Post } from 'src/entities/post.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AddCommentDto, UpdateCommentDto } from './dto/add-comment.dto';
import { MESSAGES } from './comment.messages';
import { COMMENT_TYPE } from 'src/shared/constants';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: MongoRepository<Comment>,
    @InjectRepository(Post)
    private postRepository: MongoRepository<Post>,
    private userRepository: UserRepository,
  ) {}

  async addComment(reqUser, comment: AddCommentDto) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(reqUser.id) },
    });
    if (!user) {
      throw new HttpException(MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (comment.ref === COMMENT_TYPE.POST) {
      const post = await this.postRepository.findOne({
        where: { _id: new ObjectId(comment.ref_id) },
      });
      if (!post) {
        throw new HttpException(
          MESSAGES.POST_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (comment.ref === COMMENT_TYPE.COMMENT) {
      const parent_comment = await this.commentRepository.findOne({
        where: { _id: new ObjectId(comment.ref_id) },
      });

      if (!parent_comment) {
        throw new HttpException(
          MESSAGES.COMMENT_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newComment = this.commentRepository.create({
      comment: comment.comment,
      ref_id: new ObjectId(comment.ref_id),
      ref: comment.ref,
      user: new ObjectId(user._id),
      user_info: {
        name: user.name,
        avatar: user.avatar,
      },
      likes: [],
    });

    await this.commentRepository.save(newComment);
    return { message: MESSAGES.COMMENT_ADDED, data: newComment };
  }

  async updateComment(user, comment_id: string, comment: UpdateCommentDto) {
    const commentToUpdate = await this.commentRepository.findOne({
      where: { _id: new ObjectId(comment_id) },
    });
    if (!commentToUpdate) {
      throw new HttpException(
        MESSAGES.COMMENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    commentToUpdate.comment = comment.comment;
    await this.commentRepository.save(commentToUpdate);
    return MESSAGES.COMMENT_UPDATED;
  }

  async removeComment(user, comment_id: string) {
    const commentToRemove = await this.commentRepository.findOne({
      where: { _id: new ObjectId(comment_id) },
    });
    if (!commentToRemove) {
      throw new HttpException(
        MESSAGES.COMMENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.commentRepository.remove(commentToRemove);
    return MESSAGES.COMMENT_DELETED;
  }

  async likeComment(user, comment_id: string) {
    const commentToLike = await this.commentRepository.findOne({
      where: { _id: new ObjectId(comment_id) },
    });
    if (!commentToLike) {
      throw new HttpException(
        MESSAGES.COMMENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    let msg: string;
    if (commentToLike.likes.includes(user.id)) {
      commentToLike.likes = commentToLike.likes.filter(
        (like) => like !== user.id,
      );
      msg = MESSAGES.LIKE_REMOVED;
    } else {
      commentToLike.likes.push(user.id);
      msg = MESSAGES.COMMENT_LIKED;
    }
    await this.commentRepository.save(commentToLike);
    return msg;
  }
}
