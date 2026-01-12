import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { ToolsCallBody } from './models/tools.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('tools/list')
  listTools() {
    return {
      tools: [
        {
          name: 'stack.recommend',
          description:
            'Recomienda stack React + Capacitor + Tailwind + Konsta + plugins sugeridos',
          inputSchema: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['ios', 'android', 'both'],
                default: 'both',
              },
              features: {
                type: 'array',
                items: { type: 'string' },
                description: 'Ej: ["camera","geolocation","push","filesystem"]',
              },
              theme: {
                type: 'string',
                enum: ['ios', 'material'],
                default: 'ios',
              },
            },
          },
        },
        {
          name: 'cap.plugins',
          description:
            'Lista plugins oficiales y community recomendados por feature',
          inputSchema: {
            type: 'object',
            properties: {
              features: { type: 'array', items: { type: 'string' } },
            },
            required: ['features'],
          },
        },
        {
          name: 'cap.install',
          description: 'Genera comandos npm para instalar plugins y hacer sync',
          inputSchema: {
            type: 'object',
            properties: {
              packages: { type: 'array', items: { type: 'string' } },
            },
            required: ['packages'],
          },
        },
        {
          name: 'ui.tailwind',
          description:
            'Devuelve configuración/snippet para Tailwind en React (Vite)',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'ui.konsta',
          description:
            'Devuelve snippet Konsta UI + Tailwind, ideal para Capacitor',
          inputSchema: {
            type: 'object',
            properties: {
              theme: {
                type: 'string',
                enum: ['ios', 'material'],
                default: 'ios',
              },
            },
          },
        },
        {
          name: 'cap.verify',
          description:
            'Valida si una lista de paquetes entra en la política “verificados”',
          inputSchema: {
            type: 'object',
            properties: {
              packages: { type: 'array', items: { type: 'string' } },
            },
            required: ['packages'],
          },
        },
      ],
    };
  }

  @Post('tools/call')
  callTool(@Body() body: ToolsCallBody) {
    const name = body?.name;
    const args = body?.arguments ?? {};

    if (name === 'ui.konsta') {
      const theme = args.theme ?? 'ios';
      return {
        content: [
          {
            type: 'text',
            text: `✅ Konsta UI snippet (React)

import React from "react";
import { App, Page, Navbar, Block } from "konsta/react";

export default function Root() {
  return (
    <App theme="${theme}">
      <Page>
        <Navbar title="La Bella Italia" />
        <Block strong>Hola desde Konsta + Tailwind + Capacitor</Block>
      </Page>
    </App>
  );
}
`,
          },
        ],
      };
    }

    if (name === 'ui.tailwind') {
      return {
        content: [
          {
            type: 'text',
            text: `✅ Tailwind (Vite + React) comandos típicos

npm install tailwindcss @tailwindcss/vite
npx tailwindcss init -p

  En vite.config.ts
  import tailwindcss from '@tailwindcss/vite'
  en plugins agregar tailwindcss(),

En src/index.css:
@import "tailwindcss";
`,
          },
        ],
      };
    }

    if (name === 'cap.plugins') {
      const features: string[] = args.features ?? [];
      const map: Record<string, string[]> = {
        camera: ['@capacitor/camera'],
        geolocation: ['@capacitor/geolocation'],
        filesystem: ['@capacitor/filesystem'],
        haptics: ['@capacitor/haptics'],
        statusbar: ['@capacitor/status-bar'],
        splash: ['@capacitor/splash-screen'],
        keyboard: ['@capacitor/keyboard'],
        share: ['@capacitor/share'],
        toast: ['@capacitor/toast'],
      };

      const packages = features.flatMap((f) => map[f] ?? []);
      return {
        content: [
          {
            type: 'text',
            text: packages.length
              ? packages.join('\n')
              : 'No hay match para esas features.',
          },
        ],
        data: { packages },
      };
    }

    if (name === 'cap.install') {
      const packages: string[] = args.packages ?? [];
      const uniq = [...new Set(packages)].filter(Boolean);
      return {
        content: [
          {
            type: 'text',
            text: `✅ Instalar + sync

npm i ${uniq.join(' ')}
npx cap sync
`,
          },
        ],
      };
    }

    if (name === 'stack.recommend') {
      const theme = args.theme ?? 'ios';
      const features: string[] = args.features ?? [];
      return {
        content: [
          {
            type: 'text',
            text: `📦 Stack recomendado (React + Capacitor + Tailwind + Konsta)

UI:
- tailwindcss
- konsta/react (theme: ${theme})

Capacitor:
- @capacitor/core + @capacitor/cli
- Plugins oficiales según features: ${features.length ? features.join(', ') : '(ninguna)'}
Tip: prioriza plugins oficiales (@capacitor/*) y luego community curados.

Workflow:
- Vite + React
- npx cap add ios/android
- npx cap sync
- (opcional) live reload con "npx cap run ..."
`,
          },
        ],
      };
    }

    if (name === 'cap.verify') {
      const packages: string[] = args.packages ?? [];
      const uniq = [...new Set(packages)].filter(Boolean);

      // “Verificados” (política simple)
      const allowExact = new Set([
        'react',
        'react-dom',
        'tailwindcss',
        'postcss',
        'autoprefixer',
        'konsta',
        'konsta/react',
        '@capacitor/core',
        '@capacitor/cli',
      ]);

      const allowPrefix = [
        '@capacitor/', // plugins oficiales (camera, geolocation, etc)
      ];

      const verified: string[] = [];
      const warning: string[] = [];
      const blocked: string[] = [];

      for (const p of uniq) {
        const ok =
          allowExact.has(p) || allowPrefix.some((pref) => p.startsWith(pref));

        if (ok) verified.push(p);
        else warning.push(p); // cambiar esto a blocked si es estricto
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ Verificados:\n${verified.map((x) => `- ${x}`).join('\n') || '(ninguno)'}\n
⚠️ No verificados (revisar):\n${warning.map((x) => `- ${x}`).join('\n') || '(ninguno)'}
`,
          },
        ],
        data: { verified, warning, blocked },
      };
    }

    return { content: [{ type: 'text', text: `Tool no encontrada: ${name}` }] };
  }
}
