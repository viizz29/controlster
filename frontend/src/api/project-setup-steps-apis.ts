import api from "./client";

export interface ProjectSetupStepRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  executed: boolean;
}

export const getProjectSetupSteps = async (
  projectId: string,
): Promise<ProjectSetupStepRecord[]> => {
  const res = await api.get(`/v1/project-setup-steps/${projectId}`);
  return res.data;
};
