import api from "./client";

export interface ProjectDesignStepRecord {
  id: string;
  projectId: string;
  name: string;
  description: string;
  executed: boolean;
}

export const getProjectDesignSteps = async (
  projectId: string,
): Promise<ProjectDesignStepRecord[]> => {
  const res = await api.get(`/v1/project-design-steps/${projectId}`);
  return res.data;
};
