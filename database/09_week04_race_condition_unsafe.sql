-- =========================================
-- BUOI 4: TAI HIEN RACE CONDITION (KHONG AN TOAN)
-- Mo hai Query Tool: Tab A va Tab B. Chay Tab A truoc,
-- ngay sau do chay Tab B trong luc Tab A dang cho 8 giay.
-- Sau thi nghiem, chay lai 08_week04_demo_setup.sql de reset.
-- =========================================

-- ===== TAB A =====
BEGIN;

SELECT cs.id, cs.capacity,
       COUNT(e.student_id) AS enrolled
FROM class_sections AS cs
LEFT JOIN enrollments AS e
    ON e.class_section_id = cs.id
WHERE cs.id = 'RACE-01'
GROUP BY cs.id, cs.capacity;

SELECT pg_sleep(8);

INSERT INTO enrollments (student_id, class_section_id)
VALUES ('22000002', 'RACE-01');

COMMIT;

-- ===== TAB B =====
BEGIN;

SELECT cs.id, cs.capacity,
       COUNT(e.student_id) AS enrolled
FROM class_sections AS cs
LEFT JOIN enrollments AS e
    ON e.class_section_id = cs.id
WHERE cs.id = 'RACE-01'
GROUP BY cs.id, cs.capacity;

INSERT INTO enrollments (student_id, class_section_id)
VALUES ('22000004', 'RACE-01');

COMMIT;

-- ===== KIEM TRA KET QUA (ky vong loi: enrolled = 2, remaining = -1) =====
SELECT
    cs.id,
    cs.capacity,
    COUNT(e.student_id) AS enrolled,
    cs.capacity - COUNT(e.student_id) AS remaining
FROM class_sections AS cs
LEFT JOIN enrollments AS e
    ON e.class_section_id = cs.id
WHERE cs.id = 'RACE-01'
GROUP BY cs.id, cs.capacity;