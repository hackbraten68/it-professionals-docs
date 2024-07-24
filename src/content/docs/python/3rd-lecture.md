---
title: 3rd Lecture
---

## Inputs

```python
// 3rd-lecture.py
age = 35
age = age + 1
print(age)

name = input("Enter your name: ")
print("Hello, " + name)

age = input("Enteryour age: ")
age = int(age)
increment by 1
age = age + 1
print("Next year you are:", age)
```

### EXCERCISE 007 - Simple Chatbot

```python
// 3rd-lecture.py
# get user input
name = input("What is your name? ")
print(f"Hello {name}")
birth_year = int(input("What is your year of Birth? "))

# output result
print(f"Fun Fact: 2050 you will be {2050 - birth_year} years old!")
```

### EXCERCISE 008 - Pseudo Code Sorting Algorithm

```python
// 3rd-lecture.py
numbers = [4, 2, 3, 1, 2]
numbers.sort()
print(numbers)
```

### EXCERCISE 011 - Answer is 42

Have a look at the Code below and answer the following:

- What would happen if we did not use the int()- function
- What is the data type of the output in the terminal ?
- What would the user have to enter as input to generate the output FALSE

```python
// 3rd-lecture.py
the_answer = 42
your_answer = int(input("Your number: "))
print(the_answer != your_answer)
```

<details>
  <summary>Answers</summary>
  
</details>

### EXCERCISE 012 - Age Check

```python
// 3rd-lecture.py
age = int(input("Your age: "))
print(age >= 18)
```

a -> True
b -> False
c -> invalid, no int

### EXCERCISE 013.1 - Boolean Brain Chain

```python
// 3rd-lecture.py
result = True and not False or False
print(result)
```

This expression involves boolean operations using `and`, `not`, and `or`. To understand it, we need to consider the order of operations in Python:

1. `not` has the highest precedence.
2. `and` has the next highest precedence.
3. `or` has the lowest precedence of these three.

Let's evaluate the expression step-by-step:

1. **Evaluate `not False`:**
   - `not False` evaluates to `True`.

   Our expression is now equivalent to: `True and True or False`.

2. **Evaluate `True and True`:**
   - `True and True` evaluates to `True`.

   Our expression is now equivalent to: `True or False`.

3. **Evaluate `True or False`:**
   - In an `or` operation, if the first operand is `True`, the entire expression is `True` regardless of the second operand.

   So, `True or False` evaluates to `True`.

Therefore, the final result is `True`.

### EXCERCISE 013.2 - Boolean Brain Chain

```python {5-6}
// 3rd-lecture.py
x = 5
y = 10

result = (x < y or x == y) and not (x * 2 == y)
print(result)
```

We'll evaluate this expression from left to right, considering operator precedence:

First, let's evaluate the parts inside the parentheses:
a. `(x < y or x == y)`:

`x < y is 5 < 10`, which is `True`
`x == y is 5 == 10`, which is `False`
`True or False` evaluates to `True`

b. `(x * 2 == y)`:

`x * 2 is 5 * 2`, which is `10`
`10 == y` is `10 == 10`, which is `True`

Now our expression looks like this:
`result = True and not True`
Next, we evaluate the not:

`not True` is `False`

Finally, we have:
`result = True and False`
`True and False` evaluates to `False`

Therefore, the final result is `False`.
