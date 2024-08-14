---
title: 4th Lecture
---

# Index

Data types like strings, lists and tuples usually consist of several elements. Each element in such data types gets a position value, a so-called index.

- An index is the position value in a sequence.
- You start counting from 0 (so the first value in a list has index 0).
- With the access operator [index value] we can access elements of a sequence.

```python
sequenz[Index]
```

The square brackets, directly after the sequence, initiate the operation of accessing elements of a sequence. Here we specify item values that we want to access. Here can be a string, tuple or a list.

```python
sequenz[start:end:step]
```

We can also extract a partial sequence. So separated by colons we can add a start index, a destination index and optionally a step value.

## Index

```python
["Mercury", "Venus", "Earth", "Mars"]
Index: 0 1 2 3
      -4 -3 -2 -1
```

## Slicing

Extracting a partial sequence using the access operator is also called slicing.

- If we want to access a subsequence, we need a start index and a target index:

  ```python
  sequence[start:end]
  ```

- The target index is exclusive!
- We can add a step value to the access operator:

  ```python
  sequence[start:end:step]
  ```

- If we write nothing to a position, Python automatically sets the default value

## Changing Strings

Strings have predefined methods with which manipulations can be implemented and information can be derived.

- `lower()`: All letters lowercase.
- `upper()`: All letters uppercase.
- `index(element)`: Returns the position of a symbol.
- `count(element)`: Counts how many times the element occurs.
- `replace(old, new)`: Replaces one element with another.

```python
string.method(parameter)
```

An instance of a certain data type: e.g. the variable name in which a string is stored. The dot conveys to Python that a method contained in the data type is initiated. A method is a function. These are defined within the structure of the data types themselves and can only be executed if an instance of the data type exists.

## Changing Lists

The big advantage of lists over many other data types is that they are mutable.

- If we want to replace a certain element of a list with another element, we can take the access operator:

  ```python
  liste[index] = neues_element
  ```

- The changes are applied directly to the original!

There are other ways to modify lists. With so-called methods we can, for example, add or delete elements.

- `append(element)`: add an element to the end of a list.
- `extend(list)`: add a list to the end of a list.
- `remove(element)`: removes an element from the list.
- `pop(index)`: removes the element at the passed position value.

```python
object.method(parameter)
```

An instance of a certain data type: e.g. the variable name in which a list is stored. The dot conveys to Python that a method contained in the data type is initiated. A method is a function. These are defined within the structure of the data types themselves and can only be executed if an instance of the data type exists.

## Python Documentation

If you want to learn more about available methods, you can follow this link to the python documentation:
[5. Data Structures — Python 3.11.5 documentation](https://docs.python.org/3/tutorial/datastructures.html)

## Exercise: Fibonacci

Write a program which adds 10 new elements to this list:

```python
seq = [1, 1]
```

Each newly added element is the sum of the last two elements of the list.
The final list should look like this:

```python
[1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
```

## Dictionary

A dictionary is also a mutable data type. Unlike lists, however, dictionaries are not sorted by index, but are structured by key-value pairs.

- A dictionary is an iterable object.
- Each element within a dictionary is a key-value pair.
- We get access to values via the key.

The keys are important to get access to values. The following properties are important for keys:

- They must be unique.
- They must not be mutable data types.

Since a dictionary is also a mutable data type, we can change values or add and delete key-value pairs.

- Using the access operator[key], we can access values and declare new values.
- If a key is not contained in our dictionary, a new key-value pair is added.

### Dictionary Methods

There are different methods for dictionary for certain tasks:

Manipulating Items:

- `dict.update(other_dict)`: Updates the dictionary with the key-value pairs from other_dict, overwriting existing keys.
- `dict.setdefault(key, default)`: Returns the value of key if it exists, otherwise sets key with the value default and returns default.
- `dict.pop(key, default)`: Removes and returns the value for key if it exists; otherwise returns default.
- `dict.popitem()`: Removes and returns the last key-value pair as a tuple.

Querying:

- `dict.get(key, default)`: Returns the value for key if it exists; otherwise returns default.
- `dict.keys()`: Returns a view object that displays a list of all keys.
- `dict.values()`: Returns a view object that displays a list of all values.
- `dict.items()`: Returns a view object that displays a list of dictionary's key-value tuple pairs.

Other Operations:

- `dict.copy()`: Returns a shallow copy of the dictionary.
- `dict.clear()`: Removes all items from the dictionary.
- `key in dict`: Checks if key exists in dictionary.

## Nesting of data structures

Data structures can be nested within each other.

Example: A dictionary of customer data, where each customer record is in turn a list.

## Exercise: Customer Base I

Transfer the following structure to a new python script:

```python
# customerbase.py
data = {"people": [
    {"name":"Alice", "age":30, "email":"alice@email.com"},
    {"name":"Bob", "age": 40, "email":"bob@email.com"},
    {"name":"Charlie", "age": 50}
]}
```

## Exercise: Customer Base II

You have to make several changes to the data structure:

- Today is Bob's birthday. Change his age!
- Add the email-address charlie@email.com to "Charlie's dictionary"
- You have a new customer:
  - name: Dorothy
  - age: 27
  - email: doro@email.com

## Functions / Modulation

A function is some sort of a little program. This little program is designed to do a specific task. For example, to find a maximum value in a list or to ask the user for input.

### Built-In Functions

[List of Python's built-in functions](https://docs.python.org/3/library/functions.html#built-in-functions)

## Exercise: Data Type Converter

Consider the following list:

```python
data = ['1', 2, 3.0, '4', 5.6]
```

Write an algorithm, which transforms all elements of the list data to the data type int.

## Reusability

Very often a program writer will want to use certain instructions more often. We could, of course, do the work of writing down the same lines of code every time we have a new list. But this is not very elegant! And only makes our script unnecessarily long!

Don't Repeat Yourself (DRY)

### Functions

Instead, we can define the instructions in a function. In a function, the workflows are defined. These are initially written down schematically, without passing concrete values.

```python
def function_name(parameter):
    # Function body
    # Instructions
    return return_value
```

## Exercise: Your First Function

Write a function which takes a list of numbers as input. The function calculates and returns the mean value of that list. Use your function to find the mean values of the following lists:

```python
d1 = [4, 2, 5, 1, 2, 1, 6]
d2 = [1, 2, 3, 4, 5]
d3 = [-99, 105]
```

```python
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

## EXCERCISE 17

```python
numbers = "123456789"

for digit in numbers:
   num = int(digit)
   square = num ** 2
   print(square)
```

## EXCERCISE 18

### FOR - LOOP

```python
for i in range(1,100+1):
   print(f"for loop - {i}")
```

### WHILE LOOP

```python
num = 1
while num <= 100:
   print(f"while-loop - {num}")
   num += 1
```

## EXCERCISE 19

```python
score = float(input("Enter your score: "))

if score < 0 or score > 100:
   print("Invalid number")
elif score < 41:
   print("you failed the exam")
elif score < 81:
   print("You passed, but you did not do amazing")
elif score < 100:
   print("Congratz! you did well")
else:
   print("You have perfect score!")
```

## EXCERCISE 20

# tba

## EXCERCISE 21.1

```python
username = input("User: ")
password = input("Password: ")

result = (username == 'admin' and password == '1234')
print(result)
```

## EXCERCISE 22

```python
text = input("Enter a Text: ")
output = ""
vowels = "aeiouAEIOU"

for char in text:
    if char not in vowels:
        output += char

print(output)
```

## SCRIPT EXAMPLE

```python
new_list = [1, 4.20, 3, "Hello"]
print(new_list)

new_list[3] = [2, 3]

print(new_list)
print(new_list[3][0])
```

## EXCERCISE 24

```python
grades = [2, 1, 4, 2, 2, 3, 3, 5]

total = 0
count = 0

for grade in grades:
    total += grade
    count += 1

mean = total / count

print(f"The mean grade is: {mean}")
print(count)
```

## HOMEWORK - EXCERCISE 28

```python
def calculate_mean(numbers):
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

d1 = [4, 2, 5, 1, 2, 1, 6]
d2 = [1, 2, 3, 4, 5]
d3 = [-99, 105]

print(f"Mean of d1: {calculate_mean(d1)}")
print(f"Mean of d2: {calculate_mean(d2)}")
print(f"Mean of d3: {calculate_mean(d3)}")
```
