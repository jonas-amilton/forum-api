import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { PublicUserDto } from './dto/public-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async user(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<PublicUserDto | null> {
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async createUser(data: CreateUserDto): Promise<PublicUserDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<PublicUserDto> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async findForAuth(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<AuthUserDto | null> {
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }
}
