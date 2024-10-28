import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTaskDetailDto {
  @IsNumber()
  readonly ingredientId: number;

  @IsNumber()
  readonly itemId: number;

  @IsNumber()
  readonly weight: number;

  @IsNumber()
  readonly taskId: number;
}

export class UpdateTaskDetailDto extends PartialType(CreateTaskDetailDto) {}
