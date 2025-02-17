import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
    // При запуске приложения проверяем, существует ли пользователь admin
    this.ensureAdminUser();
  }

  /**
   * Проверяет, существует ли пользователь admin. Если нет, создает его.
   */
  async ensureAdminUser() {
    const admin = await this.prisma.user.findUnique({
      where: { username: 'admin' },
    });
    if (!admin) {
      const hashedPassword = await this.hashPassword('admin');
      await this.prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          role: 'ADMIN',
          forceChangePassword: true,
        },
      });
    }
  }

  /**
   * Хеширует пароль с использованием bcrypt.
   * @param password Пароль для хеширования.
   * @returns Хешированный пароль.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Находит пользователя по имени пользователя.
   * @param username Имя пользователя.
   * @returns Пользователь или null, если не найден.
   */
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /**
   * Находит пользователя по id.
   * @param id id пользователя.
   * @returns Пользователь или null, если не найден.
   */
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Обновляет пароль пользователя и сбрасывает флаг forceChangePassword.
   * @param userId ID пользователя.
   * @param newPassword Новый пароль.
   * @returns Обновленный пользователь.
   */
  async updatePassword(userId: number, newPassword: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, forceChangePassword: false },
    });
  }
}
