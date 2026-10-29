export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type Building = { id: number; name: string };
export type Complaint = {
  id: number;
  building_id: number;
  building?: Building;
  category: string;
  title: string;
  content: string;
  reporter_name: string;
  phone: string;
  received_date: string;
  status: string;
  memo: string | null;
  created_at: string;
};

export class ApiError extends Error {
  fields: Record<string, string>;
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.fields = fields;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
  } catch {
    throw new ApiError('서버에 연결하지 못했어요. 잠시 뒤 다시 시도해 주세요. (무료 서버는 첫 접속이 1분 가까이 걸릴 수 있어요)');
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      (body && typeof body.message === 'string' && body.message) || '문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.',
      (body && body.fields) || {},
    );
  }
  return body as T;
}

export const STATUS_CLASS: Record<string, string> = {
  접수: 'badge new',
  '처리 중': 'badge doing',
  완료: 'badge done',
};
