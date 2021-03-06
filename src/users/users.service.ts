import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const salt = process.env.SALT;
    const hash = await bcrypt.hash(password, salt);
    const user = new this.userModel({ ...createUserDto, password: hash });
    return user.save();
  }

  async findAll() {
    const data = await this.userModel.find({}).sort({ name: 'asc' });
    const total = await this.userModel.count({});
    return {
      data,
      total,
    };
  }

  async findOne(username: string) {
    const user = await this.userModel.findOne({
      username,
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const salt = process.env.SALT;
    const hash = await bcrypt.hash(password, salt);
    return this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, password: hash },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
