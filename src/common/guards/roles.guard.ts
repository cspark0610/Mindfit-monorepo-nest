import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Type,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from 'src/users/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MindfitException } from 'src/common/exceptions/mindfitException';

export function RolesGuard(...roles: Roles[]): Type<CanActivate> {
  @Injectable()
  class RolesGuard extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const ctx = GqlExecutionContext.create(context);
      const role = ctx.getContext().req.user?.role;

      if (!roles.includes(role))
        throw new MindfitException({
          error: 'Invalid User Role',
          errorCode: `USER_ROLE_UNAUTHORIZED`,
          statusCode: HttpStatus.UNAUTHORIZED,
        });

      return true;
    }
  }

  return RolesGuard;
}
