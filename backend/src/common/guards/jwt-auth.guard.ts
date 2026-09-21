import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getConfigOrThrow } from 'src/lib/config-utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const API_BASE_URL = getConfigOrThrow('API_BASE_URL');

    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || request.url;

    const authPrefix = `${API_BASE_URL ? '/' + API_BASE_URL : ''}/v1/auth`;
    if (path.startsWith(authPrefix)) {
      return true;
    }

    return super.canActivate(context);
  }
}
