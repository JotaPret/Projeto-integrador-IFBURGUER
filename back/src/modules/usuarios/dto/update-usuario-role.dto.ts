import { IsEnum } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

export class UpdateUsuarioRoleDto {
  @IsEnum(Role)
  role: Role;
}
