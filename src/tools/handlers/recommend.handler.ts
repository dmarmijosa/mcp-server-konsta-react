import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

export function handleRecommend(args: ToolsCallArgumentsDTO): ToolResponse {
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
