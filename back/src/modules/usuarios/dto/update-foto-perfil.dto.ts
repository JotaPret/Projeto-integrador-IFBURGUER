import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFotoPerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  fotoPerfil?: string | null;
}
