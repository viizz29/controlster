import api from "./client";

export interface ProjectDeploymentStepRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  executed: boolean;
}

export const getProjectDeploymentSteps = async (
  projectId: string,
): Promise<ProjectDeploymentStepRecord[]> => {
  const res = await api.get(`/v1/project-deployment-steps/${projectId}`);
  return res.data;
};
