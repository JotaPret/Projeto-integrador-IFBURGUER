import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  nome: string;
}
