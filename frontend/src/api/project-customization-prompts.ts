import api from "./client";

export interface ProjectCustomizationPromptRecord {
  id: string;
  projectId: string;
  prompt: string;
  executed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNextFivePendingProjectCustomizationPrompts = async (
  projectId: string,
): Promise<ProjectCustomizationPromptRecord[]> => {
  const res = await api.get(
    `/v1/project-customization-prompts/${projectId}/pending`,
  );
  return res.data;
};

export const getLastFiveExecutedProjectCustomizationPrompts = async (
  projectId: string,
): Promise<ProjectCustomizationPromptRecord[]> => {
  const res = await api.get(
    `/v1/project-customization-prompts/${projectId}/executed`,
  );
  return res.data;
};

export const markPromptAsExecuted = async (promptId: string) => {
  const res = await api.patch(
    `/v1/project-customization-prompts/${promptId}/executed`,
  );
  return res.data;
};

export const getAllPendingProjectCustomizationPrompts = async (
  projectId: string,
  moduleName: string | null = null,
): Promise<ProjectCustomizationPromptRecord[]> => {
  const res = await api.get(
    `/v1/project-customization-prompts/${projectId}/all-pending/${moduleName}`,
  );
  return res.data;
};
