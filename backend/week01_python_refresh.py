students = [
    {"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
    {"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]

courses = [
    {
        "code": "INT2204",
        "name": "Co so du lieu Web va he thong thong tin",
        "capacity": 3,
        "enrolled": 2,
    },
    {
        "code": "INT2205",
        "name": "Khai pha du lieu",
        "capacity": 2,
        "enrolled": 2,
    },
]

enrollments = [
    {"student_id": "22000001", "course_code": "INT2204"}
]


# Tìm học phần theo mã
def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course

    return None


# Đăng ký học phần
def enroll_student(student_id, course_code):

    # 1. Kiểm tra sinh viên có tồn tại không
    student_exists = False

    for student in students:
        if student["id"] == student_id:
            student_exists = True
            break

    if not student_exists:
        return False, "Sinh vien khong ton tai"

    # 2. Kiểm tra học phần có tồn tại không
    course = find_course(course_code)

    if course is None:
        return False, "Hoc phan khong ton tai"

    # 3. Kiểm tra lớp còn chỗ không
    if course["enrolled"] >= course["capacity"]:
        return False, "Lop da du so luong"

    # 4. Kiểm tra sinh viên đã đăng ký chưa
    for item in enrollments:
        if item["student_id"] == student_id:
            if item["course_code"] == course_code:
                return False, "Sinh vien da dang ky hoc phan nay"

    # 5. Đăng ký thành công
    enrollments.append({
        "student_id": student_id,
        "course_code": course_code
    })

    course["enrolled"] += 1

    return True, "Dang ky thanh cong"


# 1. Đăng ký thành công
print("1.", enroll_student("22000002", "INT2204"))

# 2. Đăng ký trùng
print("2.", enroll_student("22000001", "INT2204"))

# 3. Lớp đã đầy
print("3.", enroll_student("22000001", "INT2205"))

# 4. Mã học phần không tồn tại
print("4.", enroll_student("22000002", "INT9999"))

# 5. Mã sinh viên không tồn tại
print("5.", enroll_student("99999999", "INT2204"))