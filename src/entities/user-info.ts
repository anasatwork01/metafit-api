import { ObjectId } from 'mongodb';
import { Column } from 'typeorm';

export class UserInfo {
  @Column()
  name: string;

  @Column()
  avatar: string;
}
