import api from "./client";

export interface DataNode {
  id: string;
  parentId: string;
  note: string;
  position: number;
  attributes: any;
  children: DataNode[];
}

export interface DataNodeBasicInfo {
  id: string;
  note: string;
}

export interface DataNodePositionInfo {
  id: string;
  position: number;
}

export const getDataNodes = async (parentId?: string): Promise<DataNode[]> => {
  if (parentId) {
    const res = await api.get(`/v1/data-nodes/${parentId}`);
    return res.data;
  } else {
    const res = await api.get("/v1/data-nodes");
    return res.data;
  }
};

export const createDataNode = async (parentId: string, note: string) => {
  const res = await api.post(`/v1/data-nodes/${parentId}`, { note });
  return res.data;
};

export const getDataNodeById = async (id?: string) => {
  const res = await api.get(`/v1/data-nodes/${id}/get`, {});
  return res.data;
};

export const updateDataNode = async (id: string, note: string) => {
  const res = await api.patch(`/v1/data-nodes/${id}`, { note });
  return res.data;
};

export const deleteDataNode = async (id: string) => {
  const res = await api.delete(`/v1/data-nodes/${id}`);
  return res.data;
};

export const updateDataNodeAttributes = async (id: string, attributes: any) => {
  const res = await api.patch(`/v1/data-nodes/${id}/attributes`, {
    attributes,
  });
  return res.data;
};

export const moveNodeToOtherParent = async (id: string, parentId: string) => {
  const res = await api.patch(`/v1/data-nodes/${id}/move-to/${parentId}`, {});
  return res.data;
};

export const getTodaysNode = async (): Promise<DataNode> => {
  const res = await api.get("/v1/data-nodes/today");
  return res.data;
};

export const getNodeFullPath = async (
  id?: string,
): Promise<DataNodeBasicInfo[]> => {
  if (!id) return [];

  const res = await api.get(`/v1/data-nodes/${id}/path`);
  return res.data;
};

export const updateDataNodeOrder = async (nodes: DataNodePositionInfo[]) => {
  return api.post("/v1/data-nodes/reorder", { nodes });
};

export const searchDataNodes = async (query: string): Promise<DataNode[]> => {
  if (!query.trim()) return [];
  const res = await api.get(
    `/v1/data-nodes/search?query=${encodeURIComponent(query)}`,
  );
  return res.data;
};
