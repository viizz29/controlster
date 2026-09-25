import api from "./client";

export interface ProjectTemplateInputData {
  url: string;
  description: string;
  properties: Record<string, any>;
  docs: string[];
}

export interface ProjectTemplateRecord extends ProjectTemplateInputData {
  id: string;
}

export const createProjectTemplate = async (data: ProjectTemplateInputData) => {
  const res = await api.post(`/v1/project-templates`, data);
  return res.data;
};

export const getProjectTemplateList = async (): Promise<
  ProjectTemplateRecord[]
> => {
  const res = await api.get("/v1/project-templates");
  return res.data;
};

export const getProjectTemplate = async (
  templateId: string,
): Promise<ProjectTemplateRecord> => {
  const res = await api.get(`/v1/project-templates/${templateId}`);
  return res.data;
};

export const deleteProjectTemplate = async (id: string) => {
  const res = await api.delete(`/v1/project-templates/${id}`);
  return res.data;
};

export const updateProjectTemplate = async (
  id: string,
  info: ProjectTemplateInputData,
) => {
  const res = await api.patch(`/v1/project-templates/${id}`, info);
  return res.data;
};
