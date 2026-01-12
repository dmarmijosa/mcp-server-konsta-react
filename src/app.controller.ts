/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ToolsCallBodyDTO } from './dto/toolsCallBody.dto';
import type { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'ok', version: '1.0.2' };
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
  @UsePipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: false,
    }),
  )
  mcp(@Body() req: any) {
    return this.appService.mcpTools(req);
  }

  @Get('mcp')
  mcpSse(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`: connected\n\n`);

    const t = setInterval(() => res.write(`: keep-alive\n\n`), 25000);
    res.on('close', () => clearInterval(t));
  }
}
