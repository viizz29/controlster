import api from "./client";

export interface Bookmark {
  nodeId: string;
  parentId: string;
  note: string;
}

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const res = await api.get("/v1/bookmarks");
  return res.data;
};

export const createBookmark = async (nodeId: string) => {
  const res = await api.post(`/v1/bookmarks/${nodeId}`, {});
  return res.data;
};
