import api from "./client";

export interface SubdomainRecord {
  id: string;
  subdomain: string;
  passCode: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubdomainCreationData {
  subdomain: string;
  passCode: string;
}

export interface SubdomainUpdateData {
  subdomain: string;
  passCode: string;
  enabled: boolean;
}

export const createSubdomain = async (data: SubdomainCreationData) => {
  const res = await api.post(`/v1/subdomains/create`, data);
  return res.data.data;
};

export const getSubdomainList = async (): Promise<SubdomainRecord[]> => {
  const res = await api.get(`/v1/subdomains/get-list`);
  return res.data.data;
};

export const deleteSubdomain = async (id: string) => {
  const res = await api.post(`/v1/subdomains/delete`, { id });
  return res.data;
};

export const updateSubdomain = async (
  id: string,
  newData: SubdomainUpdateData,
) => {
  const res = await api.post(`/v1/subdomains/update`, {
    id,
    ...newData,
  });
  return res.data;
};

export const restartSubdomainManager = async () => {
  const res = await api.post(`/v1/subdomains/restart-service`, {});
  return res.data;
};
