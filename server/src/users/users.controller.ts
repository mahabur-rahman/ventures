import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/murmurs')
  async getUserMurmurs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.getUserMurmurs(
      id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async followUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.followUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollowUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.unfollowUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/is-following')
  async isFollowing(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isFollowing = await this.usersService.isFollowing(req.user.id, id);
    return { isFollowing };
  }
}
