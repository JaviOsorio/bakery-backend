import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly status: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
