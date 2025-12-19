import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.user;
    // Map JWT payload to user object
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  },
);
