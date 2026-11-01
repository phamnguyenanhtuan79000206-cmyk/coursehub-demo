# CourseHub - Buoi 4

- Migration 001: enrollment_events.
- Demo class: RACE-01, capacity = 1.
- POST /enrollments: lock class_sections bang FOR UPDATE.
- Concurrency test: 1 request 201, 1 request 409.
- Performance data: 100000 rows, dataset=performance.
- Index: idx_enrollment_events_dataset_student_time.
- SQL injection test: GET /courses?q=%' OR '1'='1'-- tra ve [] (khong lo du lieu).

Khong commit backend/.env.

## Đo hiệu năng truy vấn enrollment_events (100.000 dòng, dataset = performance)

Truy vấn: 50 sự kiện gần nhất của sinh viên 22000001 từ 2025-12-20.

| | Trước index | Sau index |
|---|---|---|
| Scan | Seq Scan | Index Scan |
| Rows Removed by Filter | 99.183 | - |
| Buffers | shared hit=1137 | shared hit=50 read=3 |
| Execution Time | 12,805 ms | 0,232 ms |

Index: `idx_enrollment_events_dataset_student_time (dataset, student_id, occurred_at DESC)`.
Các cột so sánh bằng (dataset, student_id) đặt trước, cột thời gian sắp xếp giảm dần đặt sau,
nên PostgreSQL đọc đúng vùng cần thiết theo thứ tự ORDER BY và bỏ được bước Sort.
Số liệu chỉ đúng trên máy này, dữ liệu sinh tự động, không phải dữ liệu thật.