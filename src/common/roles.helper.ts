import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  VISITOR = 'VISITOR',
  ADMIN = 'ADMIN',
  REVENUEMANAGER = 'REVENUEMANAGER',
  CLUSTERMANAGER = 'CLUSTERMANAGER',
  SHIFTMANAGER = 'SHIFTMANAGER',
  FRANCHISEOWNER = 'FRANCHISEOWNER',
  CONSUMER = 'CONSUMER',
  INTERNAL = 'INTERNAL',
  INTEGRATION = 'INTEGRATION',
  WAREHOUSEADMIN = 'WAREHOUSEADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
