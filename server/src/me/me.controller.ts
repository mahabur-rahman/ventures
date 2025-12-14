import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { MurmursService } from '../murmurs/murmurs.service';
import { UsersService } from '../users/users.service';
import { CreateMurmurDto } from '../murmurs/dto/create-murmur.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private murmursService: MurmursService,
    private usersService: UsersService,
  ) {}

  @Get()
  async getCurrentUser(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Post('murmurs')
  async createMurmur(@Body() createMurmurDto: CreateMurmurDto, @Request() req) {
    return this.murmursService.createMurmur(req.user.id, createMurmurDto);
  }

  @Delete('murmurs/:id')
  async deleteMurmur(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.murmursService.deleteMurmur(id, req.user.id);
  }
}
