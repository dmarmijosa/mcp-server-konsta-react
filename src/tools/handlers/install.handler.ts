import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

export function handleInstall(args: ToolsCallArgumentsDTO): ToolResponse {
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
