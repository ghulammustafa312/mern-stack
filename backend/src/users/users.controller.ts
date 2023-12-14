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
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { USER_ROLE } from 'src/common/constants/enum';
import { IdParamDto } from './dto/id-params.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const saltOrRounds = 10;
    const hashedPassword = await hash(password, saltOrRounds);
    return this.usersService.create({ ...rest, password: hashedPassword });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async findAll(@Query() dto: ListUserDto) {
    return this.usersService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async findOne(@Param() { id }: IdParamDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async update(
    @Param() { id }: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async remove(@Param() { id }: IdParamDto) {
    return this.usersService.remove(id);
  }
}
