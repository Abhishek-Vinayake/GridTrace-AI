/**
 * API client for communicating with the FastAPI backend.
 */

import axios from 'axios';
import type { TraceCreateRequest, TraceResponse, TraceListItem } from '../types/trace';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function createTrace(data: TraceCreateRequest): Promise<TraceResponse> {
  const res = await api.post<TraceResponse>('/traces', data);
  return res.data;
}

export async function getTrace(id: string): Promise<TraceResponse> {
  const res = await api.get<TraceResponse>(`/traces/${id}`);
  return res.data;
}

export async function listTraces(): Promise<TraceListItem[]> {
  const res = await api.get<TraceListItem[]>('/traces');
  return res.data;
}
