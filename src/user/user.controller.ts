import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PublicUserDto } from './dto/public-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(
    @Body(new ValidationPipe()) userData: CreateUserDto,
  ): Promise<PublicUserDto> {
    return this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<PublicUserDto | null> {
    return this.userService.user({ id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) userData: UpdateUserDto,
  ) {
    return this.userService.updateUser({
      where: { id },
      data: userData,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) body: DeleteUserDto,
    @CurrentUser('sub') userSub: number,
  ): Promise<PublicUserDto> {
    if (userSub !== id) {
      throw new ForbiddenException('Você só pode excluir a sua própria conta.');
    }

    await this.userService.validatePasswordForId(id, body.password);

    return this.userService.deleteUser({ id });
  }
}
