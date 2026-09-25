import api from "./client";

export interface TerminalSessionRecord {
  id: string;
  cwd?: string | null;
  cols?: number | null;
  rows?: number | null;
  createdAt?: string;
  updatedAt?: string;
  pid?: number | null;
  status?: string | null;
}

export interface CreateTerminalSessionPayload {
  cwd?: string;
  cols?: number;
  rows?: number;
}

export interface ResizeTerminalSessionPayload {
  cols: number;
  rows: number;
}

const unwrapData = <T>(value: any): T => {
  if (value?.data !== undefined) {
    return value.data as T;
  }

  return value as T;
};

export const getTerminalSessions = async (): Promise<TerminalSessionRecord[]> => {
  const response = await api.get("/v1/terminals");
  return unwrapData<TerminalSessionRecord[]>(response.data) ?? [];
};

export const createTerminalSession = async (
  payload: CreateTerminalSessionPayload,
): Promise<TerminalSessionRecord> => {
  const response = await api.post("/v1/terminals", payload);
  return unwrapData<TerminalSessionRecord>(response.data);
};

export const resizeTerminalSession = async (
  sessionId: string,
  payload: ResizeTerminalSessionPayload,
) => {
  const response = await api.patch(`/v1/terminals/${sessionId}/resize`, payload);
  return unwrapData(response.data);
};

export const deleteTerminalSession = async (sessionId: string) => {
  const response = await api.delete(`/v1/terminals/${sessionId}`);
  return unwrapData(response.data);
};
