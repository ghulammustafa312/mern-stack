import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUserDto } from './dto/list-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const saltOrRounds = 10;
    const hashedPassword = await hash(password, saltOrRounds);
    return this.usersService.create({ ...rest, password: hashedPassword });
  }

  @Get()
  // @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async findAll(@Query() dto: ListUserDto) {
    return this.usersService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('local'))
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('local'))
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('local'))
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
