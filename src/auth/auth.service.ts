import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto) {
    const { email, password } = dto;
    try {
      // find user by email
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      // if user not exist throw error
      if (!existingUser) {
        throw new ForbiddenException('Invalid credentials');
      }
      // compare password
      const passwordMatch = await argon.verify(existingUser.password, password);

      // if password miss match throw error
      if (!passwordMatch) {
        throw new ForbiddenException('Invalid credentials');
      }
      // if ok send back user
      delete existingUser.password;
      return existingUser;
    } catch (err) {
      throw err;
    }
  }

  async signUp(dto: SignUpDto) {
    const { name, email, password } = dto;
    // generate password hash
    const hash = await argon.hash(password);
    // save user to db
    try {
      const savedUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });
      delete savedUser.password;
      // return the saved user
      return savedUser;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('email already taken');
        }
      }
      throw err;
    }
  }
}
