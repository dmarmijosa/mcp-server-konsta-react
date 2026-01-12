/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

export function handleRecommend(args: ToolsCallArgumentsDTO): ToolResponse {
  const theme = args.theme ?? 'ios';
  const features: string[] = args.features ?? [];

  const check = isReactProject(args);
  if (!check.ok) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ **Proyecto no verificado como React**

**Motivo:** ${check.reason}

✅ Para continuar, llama al tool con:
- \`project.framework: "react"\` **o**
- \`project.packageJson\`: pega el contenido de tu *package.json*

Ejemplo:
\`\`\`json
{
  "name": "stack_recommend",
  "arguments": {
    "project": { "framework": "react" },
    "theme": "ios",
    "features": ["camera","geolocation"]
  }
}
\`\`\`
`,
        },
      ],
    };
  }

  const featureList = features.length
    ? features.map((f) => `- ${f}`).join('\n')
    : '- (ninguna)';

  // Plugins sugeridos (oficiales) por feature
  const map: Record<string, string> = {
    camera: '@capacitor/camera',
    geolocation: '@capacitor/geolocation',
    filesystem: '@capacitor/filesystem',
    haptics: '@capacitor/haptics',
    statusbar: '@capacitor/status-bar',
    splash: '@capacitor/splash-screen',
    keyboard: '@capacitor/keyboard',
    share: '@capacitor/share',
    toast: '@capacitor/toast',
  };
  const pluginLines = features
    .filter((f) => map[f])
    .map((f) => `- ${f}: \`${map[f]}\``);

  const pluginsText = pluginLines.length
    ? pluginLines.join('\n')
    : '- (ninguno)';

  return {
    content: [
      {
        type: 'text',
        text: `## 📱 Stack recomendado (React + Capacitor + Tailwind + Konsta UI)

### ✅ Objetivo
UI móvil **iOS/Material** con **Konsta + Tailwind**, empaquetado con **Capacitor**.

---

## 1) Dependencias base

### UI (Konsta + Tailwind)
**Instala Konsta:**
\`\`\`bash
npm i konsta
\`\`\`
> Konsta asume que ya tienes React + Tailwind configurado. :contentReference[oaicite:4]{index=4}

**En tu CSS principal (por ejemplo \`src/index.css\`):**
\`\`\`css
@import "tailwindcss";
/* Konsta UI theme */
@import "konsta/react/theme.css";
\`\`\`
:contentReference[oaicite:5]{index=5}

---

## 2) App shell (Konsta)

Usa \`<App theme="${theme}">\` como wrapper global. :contentReference[oaicite:6]{index=6}

\`\`\`tsx
import React from "react";
import {
  App,
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Tabbar,
  TabbarLink,
  Button,
  Card,
} from "konsta/react";

export default function Root() {
  return (
    <App theme="${theme}">
      <Page>
        <Navbar title="La Bella Italia" />

        <Block strong inset>
          <BlockTitle>Recomendados</BlockTitle>
          <Card className="mt-2">
            <div className="text-base font-semibold">Pasta Trufa</div>
            <div className="text-sm opacity-70">20-25 min · $12</div>
            <Button className="mt-3 w-full">Agregar</Button>
          </Card>
        </Block>

        <List inset strong>
          <ListItem title="Entradas" after="8" />
          <ListItem title="Pastas" after="14" />
          <ListItem title="Postres" after="6" />
        </List>

        <Tabbar labels>
          <TabbarLink active label text="Home" />
          <TabbarLink label text="Pedidos" />
          <TabbarLink label text="Perfil" />
        </Tabbar>
      </Page>
    </App>
  );
}
\`\`\`

---

## 3) Capacitor (setup rápido)

\`\`\`bash
npm i @capacitor/core @capacitor/cli
npx cap init
# luego:
npx cap add ios
npx cap add android
npx cap sync
\`\`\`

---

## 4) Plugins recomendados (según features)

**Features pedidas:**
${featureList}

**Plugins oficiales sugeridos:**
${pluginsText}

---

## 5) Si el usuario sugiere cambios, aplica Tailwind así
- **Color/acento:** cambia \`text-*\`, \`bg-*\`, \`border-*\` en el componente afectado.
- **Espaciado:** usa \`px-4 py-3\`, \`gap-3\`, \`space-y-3\` en secciones/listas.
- **Jerarquía visual:** ajusta \`text-sm\` / \`text-base\` / \`text-lg\` + \`font-semibold\`.
- **Estados:** \`opacity-60\` para disabled, \`animate-pulse\` para loading.

---

## 6) Indicios de buen UX/UI (rápidos y prácticos)
- **Consistencia:** mismo padding y radio en cards/listas.
- **Escala tipográfica:** 3 niveles (título, cuerpo, meta).
- **Tamaño táctil:** botones y filas ≥ 44px de alto.
- **Feedback:** toasts, estados vacíos, y loading visibles.
- **Contraste:** texto legible sobre fondos claros/oscursos.

---

Si quieres, dime qué pantallas tendrá tu app (home, menú, carrito, checkout, pedidos, perfil) y te genero un “layout kit” con componentes Konsta listo para copiar/pegar.
`,
      },
    ],
  };
}

function isReactProject(args: ToolsCallArgumentsDTO): {
  ok: boolean;
  reason?: string;
} {
  // 1) Señal explícita
  if (args?.project?.framework === 'react') return { ok: true };

  // 2) Si viene package.json, validamos de verdad
  const pkgText = args?.project?.packageJson;
  if (pkgText && typeof pkgText === 'string') {
    try {
      const pkg = JSON.parse(pkgText);
      const deps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      };
      const hasReact =
        typeof deps.react === 'string' && typeof deps['react-dom'] === 'string';
      return hasReact
        ? { ok: true }
        : {
            ok: false,
            reason:
              'No encontré "react" y "react-dom" en dependencies/devDependencies.',
          };
    } catch {
      return {
        ok: false,
        reason: 'No pude parsear el package.json (JSON inválido).',
      };
    }
  }

  return {
    ok: false,
    reason:
      'No puedo verificar React. Pasa project.framework="react" o envía project.packageJson.',
  };
}
