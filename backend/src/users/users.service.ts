import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(dto: ListUserDto): Promise<{
    [x: string]: any;
    meta: { page: any; pages: any; limit: number; total: any };
  }> {
    const { search, page, limit } = dto;
    const offset = (page - 1) * limit;
    const filterQuery = {};
    if (search) filterQuery['name'] = { $regex: search, $options: 'i' };
    const [data] = await this.userModel.aggregate([
      { $match: filterQuery },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          total: [
            {
              $sortByCount: '$tag',
            },
          ],
          data: [
            {
              $skip: offset,
            },
            {
              $limit: limit,
            },

            {
              $addFields: {
                _id: '$_id',
              },
            },
          ],
        },
      },
      {
        $unwind: '$total',
      },
      {
        $project: {
          users: '$data',
          total: '$total.count',
          page: {
            $ceil: { $literal: offset / limit + 1 },
          },
          pages: {
            $ceil: {
              $divide: ['$total.count', limit],
            },
          },
        },
      },
    ]);
    return {
      users: data?.users || [],
      meta: {
        page: data?.page || 1,
        pages: data?.pages || 1,
        limit,
        total: data?.total ?? 0,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User Not Found');
    const response = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return response;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User Not Found');
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
