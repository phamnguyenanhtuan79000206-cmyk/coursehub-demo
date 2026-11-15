# Buổi 6 - Docker, Testing, CI

## Môi trường
- OS: Linux (môi trường soạn); chạy thật cần điền trên máy cá nhân
- Docker version: (điền sau khi chạy `docker --version`)
- Python / Node version: Python 3.12 (image + CI) / Node 22.12.0 (CI), Node 22 (image)

## Phạm vi đã làm
- `backend/Dockerfile`, `frontend/Dockerfile` (multi-stage: Node build -> Nginx), `frontend/nginx.conf` (reverse proxy `/api/` -> `backend:8000`).
- `compose.yaml`: backend + frontend, healthcheck `/health`, frontend chờ backend healthy; PostgreSQL vẫn ở máy host qua `host.docker.internal`.
- `backend/.env.docker.example` (commit), `backend/.env.docker` (local, bị ignore).
- `backend/tests/test_openapi_contract.py` + `conftest.py`; `backend/requirements-dev.txt`.
- `.github/workflows/ci.yml`: job backend, frontend, docker (docker chạy sau khi hai job kia đạt).
- Không đổi endpoint, transaction hay nghiệp vụ đăng ký.

## Cách chạy
```
cp backend/.env.docker.example backend/.env.docker   # điền DB_USER/DB_PASSWORD thật
docker compose up --build
# mở http://127.0.0.1:8080  (API trực tiếp: http://127.0.0.1:8000/docs)
docker compose down
```

## Kết quả local (điền sau khi chạy trên máy có Docker + PostgreSQL)
- pytest backend/tests -q:
- npm test: 8/8 pass (đã chạy)
- npm run build:
- docker compose up --build:

## Một luồng tích hợp đã kiểm tra (điền)
- Request: POST /api/enrollments {student_id: 22000004, class_section_id: WEB-01}
- HTTP status:
- SQL xác nhận (database/13_week05_verify.sql):

## Debug / AI (điền)
- Lỗi gặp phải:
- Bằng chứng đã xem:
- Nếu dùng AI: gợi ý nào đã dùng và đã xác minh thế nào?

## Pull Request / CI
- PR:
- Reviewer:
- CI run:
