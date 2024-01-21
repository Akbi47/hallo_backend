import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { ClientAtGuards } from 'src/modules/auth/guards/client-at.guard';
import { ClientRolesGuard } from 'src/modules/auth/guards/client-roles.guard';
import { UserAtGuards } from 'src/modules/auth/guards/user-at.guard';
import { UserRolesGuard } from 'src/modules/auth/guards/user-roles.guard';
import { VerifyClientUserPermission } from 'src/modules/permission/decorator/verify-client-permission';
import { VerifyInternalUserPermission } from 'src/modules/permission/decorator/verify-user-permission';
import { ClientRole } from '../enums/client.enum';
import { UserRole } from '../enums/user.enum';

export const Roles = (roles: number[]): MethodDecorator & ClassDecorator => {
  const setMetaData = SetMetadata('roles', roles);
  return setMetaData;
};

export const ClientAuth = (clientRole?: ClientRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(ClientAtGuards, ClientRolesGuard), Roles(clientRole));
};

export const UserAuth = (userRole?: UserRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(UserAtGuards, UserRolesGuard), Roles(userRole));
};

export const ClientUserAuthPermission = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(UserAtGuards, VerifyClientUserPermission));
};

export const UserAuthPermission = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(UserAtGuards, VerifyInternalUserPermission));
};
