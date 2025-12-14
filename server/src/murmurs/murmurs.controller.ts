import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('murmurs')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTimeline(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.murmursService.getTimeline(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  async getMurmurById(@Param('id', ParseIntPipe) id: number) {
    return this.murmursService.getMurmurById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeMurmur(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.murmursService.likeMurmur(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikeMurmur(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.murmursService.unlikeMurmur(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/has-liked')
  async hasUserLiked(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const hasLiked = await this.murmursService.hasUserLiked(id, req.user.id);
    return { hasLiked };
  }
}
