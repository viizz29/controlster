import api from "./client";

export interface TunnelRecord {
  id: string;
  subdomain: string;
  passCode: string;
  localPort: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TunnelCreationData {
  subdomain: string;
  passCode: string;
  localPort: number;
}

export interface TunnelUpdateData {
  subdomain: string;
  passCode: string;
  localPort: number;
  enabled: boolean;
}

export const createTunnel = async (data: TunnelCreationData) => {
  const res = await api.post(`/v1/tunnels/create`, data);
  return res.data.data;
};

export const getTunnelList = async (): Promise<TunnelRecord[]> => {
  const res = await api.get(`/v1/tunnels/get-list`);
  return res.data.data;
};

export const deleteTunnel = async (id: string) => {
  const res = await api.post(`/v1/tunnels/delete`, { id });
  return res.data;
};

export const updateTunnel = async (id: string, newData: TunnelUpdateData) => {
  const res = await api.post(`/v1/tunnels/update`, {
    id,
    ...newData,
  });
  return res.data;
};

export const restartTunnelService = async () => {
  const res = await api.post(`/v1/tunnels/restart-service`, {});
  return res.data.data;
};
