// https://stackoverflow.com/questions/57833669/how-to-get-jwt-token-from-headers-in-controller
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
