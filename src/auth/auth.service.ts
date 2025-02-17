import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Проверяет пользователя по логину и паролю.
   * @param username Имя пользователя.
   * @param pass Пароль.
   * @returns Пользователь без пароля или null, если проверка не прошла.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Генерирует JWT и возвращает информацию о пользователе.
   * @param user Пользователь.
   * @returns Объект с токеном и флагом смены пароля.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      forceChangePassword: user.forceChangePassword,
      userId: user.id,
    };
  }

  /**
   * Меняет пароль пользователя и сбрасывает флаг forceChangePassword.
   * @param userId ID пользователя.
   * @param newPassword Новый пароль.
   * @returns Обновленный пользователь.
   */
  async changePassword(userId: number, newPassword: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID not provided');
    }
    const user = await this.usersService.findById(Number(userId));
    Logger.log(user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Проверка, что новый пароль не совпадает с текущим
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    // if (isSamePassword) {
    //   throw new UnauthorizedException(
    //     'New password must be different from the current one',
    //   );
    // }

    return this.usersService.updatePassword(user.id, newPassword);
  }
}
