/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class JsonRpcReqDTO {
  jsonrpc: string;

  @IsString()
  method: string;

  //   @ValidateNested()
  //   @Type(() => ToolsCallBodyDTO)
  @IsOptional()
  params?: any;

  @IsOptional()
  @ValidateIf((o) => typeof o.id === 'string')
  @IsString()
  @ValidateIf((o) => typeof o.id === 'number')
  @IsNumber()
  id?: string | number | null;
}
