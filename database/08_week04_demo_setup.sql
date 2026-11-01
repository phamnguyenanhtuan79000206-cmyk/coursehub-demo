-- =========================================
-- BUOI 4: TAO LOP RACE-01
-- Suc chua: 1 sinh vien
-- =========================================

-- 1. Tao lop RACE-01
INSERT INTO class_sections
    (id, course_code, semester_code, lecturer_id, capacity)
VALUES
    ('RACE-01', 'INT2204', '2026-1', 'GV01', 1)
ON CONFLICT (id) DO UPDATE
SET capacity = EXCLUDED.capacity;

-- 2. Xoa dang ky cu cua lop RACE-01
DELETE FROM enrollments
WHERE class_section_id = 'RACE-01';

-- 3. Xoa lich su demo cu
DELETE FROM enrollment_events
WHERE class_section_id = 'RACE-01'
  AND dataset = 'demo';

-- 4. Kiem tra ket qua
SELECT class_id, capacity, enrolled, remaining
FROM v_section_summary
WHERE class_id = 'RACE-01';