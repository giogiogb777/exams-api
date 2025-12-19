import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class ModeratorOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Allow both MODERATOR and ADMIN
    if (user.role !== UserRole.MODERATOR && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only Moderator or Admin can access this resource');
    }

    return true;
  }
}
