import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly marginTolerance: number;

  @IsOptional()
  @IsString()
  readonly status: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
