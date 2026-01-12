import { ToolResponse } from '../../interfaces/tool-response.interface';

export function handleTailwind(): ToolResponse {
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
