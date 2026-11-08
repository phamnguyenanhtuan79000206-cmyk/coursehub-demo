# CourseHub - Buổi 5: Xây dựng Frontend với React kết nối FastAPI

## 1. Mục tiêu và thành phần hoàn thành
- Khởi tạo thư mục `frontend/` sử dụng React 18, Vite 7 và CSS thuần chuẩn Responsive (Flexbox, Grid, Table scroll).
- Cấu hình CORS tại FastAPI `backend/app/main.py`: cho phép origin `http://localhost:5173` và `http://127.0.0.1:5173` với các method `GET`, `POST`, `DELETE`.
- Thiết lập biến môi trường `VITE_API_BASE_URL=http://127.0.0.1:8000` trong `.env.local` (không commit) và tệp mẫu `.env.example`.
- Xây dựng module gọi API tập trung `src/api.js` (xử lý JSON, 204 No Content, format lỗi 422/404/409, abort signal, bắt lỗi mạng).
- Xây dựng các UI component theo mô hình component-driven:
  - `Notice.jsx`: hiển thị trạng thái đang tải, thông báo thành công hoặc lỗi nghiệp vụ.
  - `SectionTable.jsx`: hiển thị danh sách lớp, liên kết tên môn học từ `/courses`, số chỗ còn lại (`remaining`), nút Đăng ký kiểm soát trạng thái disabled (hết chỗ / đã đăng ký / đang gửi request).
  - `EnrollmentList.jsx`: hiển thị danh sách lớp đã đăng ký của sinh viên đang chọn, nút Hủy đăng ký với xác nhận.
  - `App.jsx`: quản lý toàn bộ state, điều phối gọi API đồng thời với `Promise.all` và dọn dẹp bằng `AbortController`, đồng bộ dữ liệu sau mỗi thao tác ghi (POST/DELETE).

## 2. Bản phác giao diện (Wireframe / Figma)
- Bố cục 2 cột (Desktop) / 1 cột (Mobile <= 900px):
  - Khối 1: Header + Chọn mã sinh viên demo (`22000001` - `22000004`), nút "Xem đăng ký" và "Tải lại dữ liệu".
  - Khối 2: Danh sách lớp học phần kèm thanh tìm kiếm từ khóa và bộ lọc checkbox "Chỉ hiện lớp còn chỗ".
  - Khối 3: Danh sách các lớp đã đăng ký của sinh viên đang chọn kèm nút "Hủy đăng ký".
  - Khối thông báo: Vùng hiển thị thông báo kết quả (thành công, lỗi 404, xung đột 409).
- Thiết kế Wireframe tham khảo: Figma Design file "CourseHub – Buổi 5" (khung 1280px Desktop và 390px Mobile).

## 3. Kết quả đối chiếu luồng đọc/ghi với CSDL PostgreSQL
- Script kiểm tra: `database/13_week05_verify.sql`

### 3.1. Đăng ký lớp WEB-01 cho sinh viên 22000004
- Giao diện gửi `POST /enrollments` với payload:
  ```json
  { "student_id": "22000004", "class_section_id": "WEB-01" }
  ```
- Kết quả API: HTTP 201 Created.
- Đối chiếu CSDL:
  - Bảng `enrollments`: Có bản ghi `(22000004, WEB-01)`.
  - View `v_section_summary`: Lớp `WEB-01` có `capacity = 3`, `enrolled = 3`, `remaining = 0`.
  - Bảng `enrollment_events`: Phát sinh sự kiện mới `event_type = 'CREATED'`, `dataset = 'demo'`.
  - Giao diện: Nút chuyển sang trạng thái "Đã đăng ký" (disabled), danh sách bên phải xuất hiện `WEB-01`.

### 3.2. Hủy đăng ký lớp WEB-01
- Giao diện gửi `DELETE /enrollments/22000004/WEB-01`.
- Kết quả API: HTTP 204 No Content (không có JSON body).
- Đối chiếu CSDL:
  - Bảng `enrollments`: Bản ghi `(22000004, WEB-01)` đã được xóa.
  - View `v_section_summary`: Lớp `WEB-01` có `enrolled = 2`, `remaining = 1`.
  - Bảng `enrollment_events`: Ghi nhận sự kiện `CANCELLED` tương ứng trong transaction.

### 3.3. Xử lý suất cuối của RACE-01 (409 Conflict)
- Khi hai cửa sổ cùng mở lớp `RACE-01` (chỉ còn 1 suất):
  - Cửa sổ A (sinh viên 22000002) gửi POST trước -> Thành công 201.
  - Cửa sổ B (sinh viên 22000004) gửi POST sau -> Backend khóa dòng và phát hiện hết chỗ -> Trả về HTTP 409 "Lop hoc phan da het cho".
  - Giao diện B bắt lỗi 409, hiển thị thông báo lỗi màu đỏ và tự động gọi lại API để làm mới số chỗ (chuyển sang nút "Hết chỗ").

## 4. Kiểm thử tự động (Unit Test api.js & Build)
- Thực hiện chạy `npm test`: 8/8 kịch bản kiểm thử giả lập HTTP thành công.
- Thực hiện chạy `npm run build`: Bản build `dist/` được tạo thành công không có cảnh báo hay lỗi cú pháp.

