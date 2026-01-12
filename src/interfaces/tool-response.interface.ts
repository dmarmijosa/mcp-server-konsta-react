export interface ToolContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

export interface ToolResponse {
  content: ToolContent[];
  data?: Record<string, any>;
}
