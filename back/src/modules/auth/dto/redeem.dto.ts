import { IsInt, Min } from 'class-validator';

export class RedeemDto {
  @IsInt()
  @Min(1)
  pontos: number;
}
