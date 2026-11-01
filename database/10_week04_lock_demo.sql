-- =========================================
-- BUOI 4: QUAN SAT ROW LOCK (SELECT ... FOR UPDATE)
-- Khong tao du lieu. Mo hai Query Tool: Tab A va Tab B.
-- Chay Tab A truoc; trong 8 giay do chay Tab B, Tab B se cho den khi Tab A COMMIT.
-- =========================================

-- ===== TAB A: khoa dong va giu 8 giay =====
BEGIN;
SELECT id, capacity
FROM class_sections
WHERE id = 'RACE-01'
FOR UPDATE;
SELECT pg_sleep(8);
COMMIT;

-- ===== TAB B: chay khi Tab A dang cho =====
BEGIN;
SELECT id, capacity
FROM class_sections
WHERE id = 'RACE-01'
FOR UPDATE;
ROLLBACK;