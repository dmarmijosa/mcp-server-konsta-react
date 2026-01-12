export const toolsMCP = [
  {
    name: 'stack_recommend',
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
        project: {
          type: 'object',
          properties: {
            framework: {
              type: 'string',
              enum: ['react', 'unknown'],
              default: 'unknown',
            },
            packageJson: {
              type: 'string',
              description:
                'Contenido de package.json (opcional) para validar React',
            },
          },
        },
      },
    },
  },
  {
    name: 'cap_plugins',
    description: 'Lista plugins oficiales y community recomendados por feature',
    inputSchema: {
      type: 'object',
      properties: {
        features: { type: 'array', items: { type: 'string' } },
      },
      required: ['features'],
    },
  },
  {
    name: 'cap_install',
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
    name: 'ui_tailwind',
    description: 'Devuelve configuración/snippet para Tailwind en React (Vite)',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'ui_konsta',
    description: 'Devuelve snippet Konsta UI + Tailwind, ideal para Capacitor',
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
    name: 'cap_verify',
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
];
