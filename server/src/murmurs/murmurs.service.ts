import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { Like } from '../entities/like.entity';
import { Follow } from '../entities/follow.entity';
import { CreateMurmurDto } from './dto/create-murmur.dto';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmurRepository: Repository<Murmur>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async getTimeline(userId: number, page: number = 1, limit: number = 10) {
    // Get users that the current user follows
    const following = await this.followRepository.find({
      where: { followerId: userId },
      select: ['followingId'],
    });

    const followingIds = following.map((f) => f.followingId);
    // Include the user's own murmurs as well
    followingIds.push(userId);

    const queryBuilder = this.murmurRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.user', 'user')
      .leftJoin('murmur.likes', 'like')
      .select([
        'murmur.id',
        'murmur.content',
        'murmur.createdAt',
        'user.id',
        'user.username',
        'user.name',
      ])
      .addSelect('COUNT(DISTINCT like.id)', 'likesCount')
      .groupBy('murmur.id')
      .addGroupBy('user.id')
      .orderBy('murmur.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (followingIds.length > 0) {
      queryBuilder.where('murmur.userId IN (:...followingIds)', {
        followingIds,
      });
    } else {
      // If not following anyone, just show own murmurs
      queryBuilder.where('murmur.userId = :userId', { userId });
    }

    const murmurs = await queryBuilder.getRawAndEntities();

    const result = murmurs.entities.map((murmur, index) => ({
      ...murmur,
      likesCount: parseInt(murmurs.raw[index].likesCount) || 0,
    }));

    const total = await queryBuilder.getCount();

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMurmurById(id: number) {
    const murmur = await this.murmurRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.user', 'user')
      .leftJoin('murmur.likes', 'like')
      .select([
        'murmur.id',
        'murmur.content',
        'murmur.createdAt',
        'user.id',
        'user.username',
        'user.name',
      ])
      .addSelect('COUNT(like.id)', 'likesCount')
      .where('murmur.id = :id', { id })
      .groupBy('murmur.id')
      .addGroupBy('user.id')
      .getRawAndEntities();

    if (!murmur.entities[0]) {
      throw new NotFoundException('Murmur not found');
    }

    return {
      ...murmur.entities[0],
      likesCount: parseInt(murmur.raw[0].likesCount) || 0,
    };
  }

  async createMurmur(userId: number, createMurmurDto: CreateMurmurDto) {
    const murmur = this.murmurRepository.create({
      content: createMurmurDto.content,
      userId,
    });

    const savedMurmur = await this.murmurRepository.save(murmur);

    return this.getMurmurById(savedMurmur.id);
  }

  async deleteMurmur(id: number, userId: number) {
    const murmur = await this.murmurRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    if (murmur.userId !== userId) {
      throw new ForbiddenException('You can only delete your own murmurs');
    }

    await this.murmurRepository.remove(murmur);

    return { message: 'Murmur deleted successfully' };
  }

  async likeMurmur(murmurId: number, userId: number) {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId },
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { murmurId, userId },
    });

    if (existingLike) {
      throw new ConflictException('You already liked this murmur');
    }

    const like = this.likeRepository.create({ murmurId, userId });
    await this.likeRepository.save(like);

    return { message: 'Murmur liked successfully' };
  }

  async unlikeMurmur(murmurId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { murmurId, userId },
    });

    if (!like) {
      throw new NotFoundException('You have not liked this murmur');
    }

    await this.likeRepository.remove(like);

    return { message: 'Murmur unliked successfully' };
  }

  async hasUserLiked(murmurId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { murmurId, userId },
    });
    return !!like;
  }
}
