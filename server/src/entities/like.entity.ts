import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity('likes')
@Unique(['userId', 'murmurId'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  murmurId: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'murmurId' })
  murmur: Murmur;

  @CreateDateColumn()
  createdAt: Date;
}
