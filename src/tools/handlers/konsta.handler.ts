import { ToolResponse } from '../../interfaces/tool-response.interface';
import { ToolsCallArgumentsDTO } from '../../dto/toolsCallBody.dto';

export function handleKonsta(args: ToolsCallArgumentsDTO): ToolResponse {
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
