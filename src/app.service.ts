/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JsonRpcReqDTO } from './dto/jsonRpcReq.dto';
import { ToolsCallBodyDTO } from './dto/toolsCallBody.dto';
import { toolsMCP } from './tools/tools.mcp';
import { ToolResponse } from './interfaces/tool-response.interface';
import {
  handleKonsta,
  handleTailwind,
  handlePlugins,
  handleInstall,
  handleRecommend,
  handleVerify,
} from './tools/handlers';

@Injectable()
export class AppService {
  mcpTools(req: JsonRpcReqDTO) {
    try {
      if (req.method === 'initialize') {
        return {
          jsonrpc: '2.0',
          id: req.id ?? null,
          result: {
            protocolVersion: '2025-06-18',
            serverInfo: { name: 'nexa-mcp', version: '1.0.0' },
            capabilities: { tools: {} },
          },
        };
      }

      // Listado estándar MCP
      if (req.method === 'tools/list') {
        const result = this.listTools();
        return { jsonrpc: '2.0', id: req.id ?? null, result };
      }

      // Ejecución estándar MCP
      if (req.method === 'tools/call') {
        const body: ToolsCallBodyDTO = req.params as ToolsCallBodyDTO;
        const result = this.callTool(body);
        return { jsonrpc: '2.0', id: req.id ?? null, result };
      }

      return {
        jsonrpc: '2.0',
        id: req.id ?? null,
        error: { code: -32601, message: `Method not found: ${req.method}` },
      };
    } catch (E: Error | any) {
      throw new HttpException(
        `Error: ${E.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  callToolsTool(body: ToolsCallBodyDTO): ToolResponse {
    return this.callTool(body);
  }

  callTool(body: ToolsCallBodyDTO): ToolResponse {
    const name = body?.name;
    const args = body?.arguments ?? {};

    const handlers: Record<string, () => ToolResponse> = {
      'ui.konsta': () => handleKonsta(args),
      'ui.tailwind': () => handleTailwind(),
      'cap.plugins': () => handlePlugins(args),
      'cap.install': () => handleInstall(args),
      'stack.recommend': () => handleRecommend(args),
      'cap.verify': () => handleVerify(args),
    };

    const handler = handlers[name];
    if (handler) {
      return handler();
    }

    return {
      content: [{ type: 'text', text: `Tool no encontrada: ${name}` }],
    };
  }

  listTools() {
    return {
      tools: [...toolsMCP],
    };
  }
}
