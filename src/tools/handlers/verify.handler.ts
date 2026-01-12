import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

const ALLOW_EXACT = new Set([
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

const ALLOW_PREFIX = ['@capacitor/'];

export function handleVerify(args: ToolsCallArgumentsDTO): ToolResponse {
  const packages: string[] = args.packages ?? [];
  const uniq = [...new Set(packages)].filter(Boolean);

  const verified: string[] = [];
  const warning: string[] = [];
  const blocked: string[] = [];

  for (const p of uniq) {
    const ok =
      ALLOW_EXACT.has(p) || ALLOW_PREFIX.some((pref) => p.startsWith(pref));

    if (ok) {
      verified.push(p);
    } else {
      warning.push(p);
    }
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
