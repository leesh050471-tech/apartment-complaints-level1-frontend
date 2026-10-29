'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, ApiError, Building, Complaint, STATUS_CLASS } from '../lib/api';

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [items, setItems] = useState<Complaint[] | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Building[]>('/buildings').then(setBuildings).catch((e: ApiError) => setError(e.message));
  }, []);

  useEffect(() => {
    setItems(null);
    api<Complaint[]>('/complaints' + (buildingId ? `?building_id=${buildingId}` : ''))
      .then((d) => { setItems(d); setError(''); })
      .catch((e: ApiError) => { setError(e.message); setItems([]); });
  }, [buildingId]);

  return (
    <>
      <h1>민원 목록</h1>
      <p className="muted">동을 눌러 동별로 모아 볼 수 있어요.</p>
      <div className="chips">
        <button className={'chip' + (buildingId === null ? ' on' : '')} onClick={() => setBuildingId(null)}>전체</button>
        {buildings.map((b) => (
          <button key={b.id} className={'chip' + (buildingId === b.id ? ' on' : '')} onClick={() => setBuildingId(b.id)}>{b.name}</button>
        ))}
      </div>
      {error && <div className="alert">{error}</div>}
      {items === null && !error && <p className="muted">불러오는 중이에요… (첫 접속은 1분 가까이 걸릴 수 있어요)</p>}
      {items && items.length === 0 && !error && <p className="muted">등록된 민원이 없어요.</p>}
      {items?.map((c) => (
        <Link key={c.id} href={`/complaints/${c.id}`} className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>{c.title}</strong>
            <span className={STATUS_CLASS[c.status]}>{c.status}</span>
          </div>
          <div className="muted">{c.building?.name} · {c.category} · {c.received_date} · {c.reporter_name}</div>
        </Link>
      ))}
    </>
  );
}
