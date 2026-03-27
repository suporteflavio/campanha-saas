import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RootGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.is_root) {
      throw new ForbiddenException('Acesso root apenas para usuários com is_root=true');
    }

    return true;
  }
}
