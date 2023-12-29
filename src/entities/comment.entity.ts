import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserInfo } from './user-info';
import { COMMENT_TYPE } from 'src/shared/constants';
// import { UserInfo } from './user-info';

@Entity('comment')
export class Comment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({
    enum: COMMENT_TYPE,
  })
  ref: COMMENT_TYPE;

  @Column()
  ref_id: ObjectId;

  @Column()
  comment: string;

  @Column()
  likes: ObjectId[];

  @Column()
  user: ObjectId;

  @Column()
  user_info: UserInfo;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
