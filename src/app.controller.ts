import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ToolsCallBodyDTO } from './dto/toolsCallBody.dto';
import { JsonRpcReqDTO } from './dto/jsonRpcReq.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'ok', version: '1.0.0' };
  }

  @Get('tools/list')
  listTools() {
    return this.appService.listTools();
  }

  @Post('tools/call')
  callTool(@Body() body: ToolsCallBodyDTO) {
    return this.appService.callToolsTool(body);
  }

  @Post('mcp')
  mcp(@Body() req: JsonRpcReqDTO) {
    return this.appService.mcpTools(req);
  }
}
