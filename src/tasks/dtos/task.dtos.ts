import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  readonly status: string;

  @IsString()
  readonly productionBatch: string;

  @IsString()
  readonly startDate: string;

  @IsString()
  readonly endDate: string;

  @IsString()
  readonly unit: string;

  @IsNumber()
  readonly repetition: number;

  @IsNumber()
  readonly productId: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
