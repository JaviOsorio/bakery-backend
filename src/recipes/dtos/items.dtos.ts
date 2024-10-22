import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateItemDto {
  @IsNotEmpty()
  @IsNumber()
  readonly cuantity: number;

  @IsNotEmpty()
  @IsString()
  readonly controlUnit: string;

  @IsNotEmpty()
  @IsNumber()
  readonly productId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly ingredientId: number;
}

export class UpdateItemtDto extends PartialType(CreateItemDto) {}
