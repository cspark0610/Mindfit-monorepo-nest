import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from 'src/users/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

export function RolesGuard(...roles: Roles[]): Type<CanActivate> {
  @Injectable()
  class RolesGuard extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const ctx = GqlExecutionContext.create(context);
      const role = ctx.getContext().req.user?.role;

      if (!roles.includes(role))
        throw new UnauthorizedException('Invalid User Role');

      return true;
    }
  }

  return RolesGuard;
}
