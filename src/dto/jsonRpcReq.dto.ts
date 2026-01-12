/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToolsCallBodyDTO } from './toolsCallBody.dto';

export class JsonRpcReqDTO {
  jsonrpc: string;

  @IsString()
  method: string;

  @ValidateNested()
  @Type(() => ToolsCallBodyDTO)
  @IsOptional()
  params?: ToolsCallBodyDTO;

  @IsString()
  @IsOptional()
  @IsNumber()
  id?: string | number;
}
