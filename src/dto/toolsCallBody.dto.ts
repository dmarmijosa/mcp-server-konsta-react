import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ToolsCallArgumentsDTO {
  @IsString()
  @IsOptional()
  theme?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  packages?: string[];
  @IsOptional()
  project?: any;
}

export class ToolsCallBodyDTO {
  @IsString()
  @IsOptional()
  name: string;

  @ValidateNested()
  @Type(() => ToolsCallArgumentsDTO)
  @IsOptional()
  arguments?: ToolsCallArgumentsDTO;
}
