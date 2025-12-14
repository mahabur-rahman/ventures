import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Follow } from '../entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.murmurs', 'murmur')
      .leftJoin('user.followers', 'follower')
      .leftJoin('user.following', 'following')
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.bio',
        'user.createdAt',
      ])
      .addSelect('COUNT(DISTINCT murmur.id)', 'murmursCount')
      .addSelect('COUNT(DISTINCT follower.id)', 'followersCount')
      .addSelect('COUNT(DISTINCT following.id)', 'followingCount')
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.user_id,
      username: user.user_username,
      name: user.user_name,
      bio: user.user_bio,
      createdAt: user.user_createdAt,
      murmursCount: parseInt(user.murmursCount),
      followersCount: parseInt(user.followersCount),
      followingCount: parseInt(user.followingCount),
    };
  }

  async getUserMurmurs(userId: number, page: number = 1, limit: number = 10) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [murmurs, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.murmurs', 'murmur')
      .leftJoinAndSelect('murmur.likes', 'like')
      .where('user.id = :userId', { userId })
      .select([
        'murmur.id',
        'murmur.content',
        'murmur.createdAt',
        'user.id',
        'user.username',
        'user.name',
      ])
      .addSelect('COUNT(like.id)', 'likesCount')
      .groupBy('murmur.id')
      .addGroupBy('user.id')
      .orderBy('murmur.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: murmurs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!following) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    const follow = this.followRepository.create({ followerId, followingId });
    await this.followRepository.save(follow);

    return { message: 'Successfully followed user' };
  }

  async unfollowUser(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }

    await this.followRepository.remove(follow);

    return { message: 'Successfully unfollowed user' };
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }
}
