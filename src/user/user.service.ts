import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<PublicUserDto> {
    return this.prisma.user.delete({
      where,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async validatePasswordForId(id: number, password: string): Promise<void> {
    const user = await this.findForAuth({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Credenciais invalidas');
    }
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
