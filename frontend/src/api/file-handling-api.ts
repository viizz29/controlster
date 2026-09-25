import api from "./client";

export interface FileRecord {
  id: string;
  originalName: string;
  size: number;
  sha256: string;
  createdAt: string;
  updatedAt: string;
}

export const uploadFileApi = async (
  file: File,
  onUploadProgress?: (progress: number) => void,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/v1/file-management/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      onUploadProgress?.(percent);
    },
  });

  return res.data;
};

export const getFileList = async (): Promise<FileRecord[]> => {
  const res = await api.get(`/v1/file-management/get-list`);
  return res.data.data;
};
