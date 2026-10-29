'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiError, Complaint, STATUS_CLASS } from '../../../lib/api';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [c, setC] = useState<Complaint | null>(null);
  const [status, setStatus] = useState('접수');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Complaint>(`/complaints/${id}`)
      .then((d) => { setC(d); setStatus(d.status); setMemo(d.memo || ''); })
      .catch((e: ApiError) => setError(e.message));
  }, [id]);

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      const d = await api<Complaint>(`/complaints/${id}`, { method: 'PATCH', body: JSON.stringify({ status, memo }) });
      setC(d); setSaved(true);
    } catch (e) {
      setError((e as ApiError).fields?.memo || (e as ApiError).fields?.status || (e as ApiError).message);
    } finally { setSaving(false); }
  }

  if (error && !c) return <><Link href="/">← 목록으로</Link><div className="alert">{error}</div></>;
  if (!c) return <p className="muted">불러오는 중이에요…</p>;

  return (
    <>
      <Link href="/">← 목록으로</Link>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h1>{c.title}</h1>
          <span className={STATUS_CLASS[c.status]}>{c.status}</span>
        </div>
        <p className="muted">{c.building?.name} · {c.category} · 접수일 {c.received_date}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{c.content}</p>
        <p className="muted">접수자 {c.reporter_name} · 연락처 {c.phone}</p>
      </div>
      <div className="card">
        <strong>처리 내용</strong>
        <label htmlFor="status">처리 상태</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>접수</option><option>처리 중</option><option>완료</option>
        </select>
        <label htmlFor="memo">처리 메모</label>
        <textarea id="memo" rows={3} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 업체 방문 예정" />
        {error && <div className="alert">{error}</div>}
        {saved && <div className="ok">저장했어요.</div>}
        <p><button className="btn" onClick={save} disabled={saving}>{saving ? '저장 중…' : '저장'}</button></p>
      </div>
    </>
  );
}
