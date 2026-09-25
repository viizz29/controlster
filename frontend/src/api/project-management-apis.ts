import api from "./client";

export interface ProjectRecord {
  id: string;
  projectTemplateId: string;
  name: string;
  description: string;
  relativePath: string;
  fullPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreationData {
  projectTemplateId: string;
  name: string;
  description: string;
}

export interface ProjectDetailUpdateData {
  name: string;
  description: string;
}

export const createProject = async (data: ProjectCreationData) => {
  const res = await api.post(`/v1/projects`, data);
  return res.data;
};

export const getProjectList = async (): Promise<ProjectRecord[]> => {
  const res = await api.get(`/v1/projects`);
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/v1/projects/${id}`);
  return res.data;
};

export const getProjectDetails = async (id: string) => {
  const res = await api.get(`/v1/projects/${id}`);
  return res.data;
};

export const executeProjectDesignStep = async (
  projectId: string,
  stepName: string,
) => {
  const res = await api.post(`/v1/projects/${projectId}/execute-design-step`, {
    stepName,
  });
  return res.data;
};

export const updateProject = async (
  id: string,
  newData: ProjectDetailUpdateData,
) => {
  const res = await api.post(`/v1/projects/update`, {
    id,
    ...newData,
  });
  return res.data;
};

export const getProjectDocument = async (id: string, stepName: string) => {
  const res = await api.get(`/v1/projects/${id}/docs/${stepName}`);
  return res.data;
};

export const executeProjectSetupStep = async (
  projectId: string,
  stepName: string,
) => {
  const res = await api.post(`/v1/projects/${projectId}/execute-setup-step`, {
    stepName,
  });
  return res.data;
};

export const getProjectCodeConfig = async (
  projectId: string,
  fileName: string | null,
) => {
  if (!fileName) {
    return {};
  }

  const res = await api.get(`/v1/projects/${projectId}/files`, {
    params: { fileName },
  });
  return res.data;
};

export const updateProjectCodeConfig = async (
  projectId: string,
  fileName: string,
  values: any,
) => {
  const res = await api.patch(`/v1/projects/${projectId}/env-file`, {
    fileName,
    values,
  });
  return res.data;
};

export const executeProjectDeploymentStep = async (
  projectId: string,
  stepName: string,
) => {
  const res = await api.post(
    `/v1/projects/${projectId}/execute-deployment-step`,
    {
      stepName,
    },
  );
  return res.data;
};
