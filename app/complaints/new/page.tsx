'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError, Building, Complaint } from '../../../lib/api';

const CATEGORIES = ['승강기', '누수', '소음', '주차', '기타'];

export default function NewComplaint() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [form, setForm] = useState({
    building_id: '', category: '', title: '', content: '', reporter_name: '', phone: '',
    received_date: new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10),
  });
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Building[]>('/buildings').then(setBuildings).catch((e: ApiError) => setError(e.message));
  }, []);

  const set = (k: string) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setFields({});
    try {
      const c = await api<Complaint>('/complaints', {
        method: 'POST',
        body: JSON.stringify({ ...form, building_id: form.building_id ? Number(form.building_id) : undefined }),
      });
      router.push(`/complaints/${c.id}`);
    } catch (err) {
      const ae = err as ApiError;
      setError(ae.message); setFields(ae.fields || {});
    } finally { setBusy(false); }
  }

  const F = ({ k, label, children }: { k: string; label: string; children: React.ReactNode }) => (
    <div><label>{label}</label>{children}{fields[k] && <div className="err">{fields[k]}</div>}</div>
  );

  return (
    <>
      <Link href="/">← 목록으로</Link>
      <h1>민원 등록</h1>
      <form onSubmit={submit} noValidate className="card">
        <F k="building_id" label="동">
          <select value={form.building_id} onChange={set('building_id')}>
            <option value="">동을 선택하세요</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </F>
        <F k="category" label="민원 종류">
          <select value={form.category} onChange={set('category')}>
            <option value="">종류를 선택하세요</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </F>
        <F k="title" label="제목"><input value={form.title} onChange={set('title')} placeholder="예: 1호기 엘리베이터 멈춤" /></F>
        <F k="content" label="내용"><textarea rows={4} value={form.content} onChange={set('content')} /></F>
        <F k="reporter_name" label="접수자 이름"><input value={form.reporter_name} onChange={set('reporter_name')} /></F>
        <F k="phone" label="연락처"><input value={form.phone} onChange={set('phone')} placeholder="010-1234-5678" /></F>
        <F k="received_date" label="접수 날짜"><input value={form.received_date} onChange={set('received_date')} placeholder="2026-10-29" /></F>
        {error && <div className="alert">{error}</div>}
        <p><button className="btn" disabled={busy}>{busy ? '등록 중…' : '등록하기'}</button></p>
      </form>
    </>
  );
}
