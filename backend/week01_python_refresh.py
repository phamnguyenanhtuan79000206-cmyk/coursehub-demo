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


def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course

print(find_course("INT2204"))