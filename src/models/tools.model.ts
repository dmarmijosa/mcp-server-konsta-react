export type ToolsCallBody = {
  name: string;
  arguments?: any;
};

export type JsonRpcReq = {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: any;
};
