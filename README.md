# 햇살마을 민원 기록장 · 프론트엔드 (Level 1)

Next.js 화면입니다. 민원 목록(동별 모아보기), 상세(처리 상태·메모), 등록 화면이 있습니다. 기획서는 `기획서.md`를 보세요.

## 설정값 (환경 변수)
| 이름 | 뜻 |
|---|---|
| `NEXT_PUBLIC_API_URL` | 백엔드 주소 (끝에 `/` 없이) |

## Vercel 설정
Framework는 Next.js 자동 인식. 위 설정값만 넣고 Deploy.

## 로컬 실행
```bash
cp .env.example .env.local
npm install
npm run dev
```

## 배포 주소
- 화면(Vercel): https://apartment-complaints-level1-fronten-delta.vercel.app
- 백엔드(Render): https://apartment-complaints-level1-backend.onrender.com
- 백엔드 저장소: https://github.com/leesh050471-tech/apartment-complaints-level1-backend
