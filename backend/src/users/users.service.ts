import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUserDto } from './dto/list-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    delete createdUser['password'];
    return createdUser;
  }

  async findAll(dto: ListUserDto): Promise<User[]> {
    const { search, page, limit } = dto;
    const offset = (page - 1) * limit;
    let filterQuery = {};
    if (search) filterQuery['name'] = { $regex: search, $options: 'i' };
    return this.userModel
      .find(filterQuery)
      .select('-password')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const response = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return response;
  }

  async remove(id: number): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
