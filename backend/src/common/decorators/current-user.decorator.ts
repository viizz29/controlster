import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  userId: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    const usss = data ? user?.[data] : user;
    if (usss.userId) {
      usss.userId = Number(usss.userId);
    }
    return usss;
  },
);
