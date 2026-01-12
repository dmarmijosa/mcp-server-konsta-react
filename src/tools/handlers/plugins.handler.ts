import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

const FEATURES_MAP: Record<string, string[]> = {
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

export function handlePlugins(args: ToolsCallArgumentsDTO): ToolResponse {
  const features: string[] = args.features ?? [];
  const packages = features.flatMap((f) => FEATURES_MAP[f] ?? []);

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
