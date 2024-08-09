---
title: 4th Lecture
---

```pyhton
num = 5
 while True:
    if num % 2 == 0:
        num += 1
        continue
    if num >= 10:
        break
    print(f"{num} is smaller than 10")
    num += 1
print("End")
```

## EXCERCISE 16

```python
number = 5

while input(">>" ) != "quit":
    if number >= 10:
        break
    print(f"number = {number}")
    number += 1
```

Q1: number = 10
Q2: 5 iterations

# EXCERCISE 17

# numbers = "123456789"

# for digit in numbers:
#    num = int(digit)
#    square = num ** 2
#    print(square)

# EXCERCISE 18

# FOR - LOOP
# for i in range(1,100+1):
#    print(f"for loop - {i}")

# WHILE LOOP
# num = 1
# while num <= 100:
#    print(f"while-loop - {num}")
#    num += 1

# EXCERCISE 19

# score = float(input("Enter your score: "))

# if score < 0 or score > 100:
#    print("Invalid number")
# elif score < 41:
#    print("you failed the exam")
# elif score < 81:
#    print("You passed, but you did not do amazing")
# elif score < 100:
#    print("Congratz! you did well")
# else:
#    print("You have perfect score!")

# EXCERCISE 20

# tba

# EXCERCISE 21.1

# username = input("User: ")
# password = input("Password: ")

# result = (username == 'admin' and password == '1234')
# print(result)

# EXCERCISE 22

# text = input("Enter a Text: ")
# output = ""
# vowels = "aeiouAEIOU"

# for char in text:
#     if char not in vowels:
#         output += char

# print(output)

# SCRIPT EXAMPLE

# new_list = [1, 4.20, 3, "Hello"]
# print(new_list)

# new_list[3] = [2, 3]

# print(new_list)
# print(new_list[3][0])

# EXCERCISE 24

# grades = [2, 1, 4, 2, 2, 3, 3, 5]

# total = 0
# count = 0

# for grade in grades:
#     total += grade
#     count += 1

# mean = total / count

# print(f"The mean grade is: {mean}")
# print(count)