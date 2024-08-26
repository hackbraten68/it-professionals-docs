---
title: Working with Functions
---
![Working with Functions](../../../assets/databases/working_with_functions/intro.png)

![What you will learn](../../../assets/databases/working_with_functions/section_goal.png)

:::tip[You will learn how to do the following:]

- Identify built-in functions.
- Examine the DATE functions that can be used in calculations.
- Calculate data by using aggregate functions.
- Manipulate string values.

Key Terms:

- Aggregate functions
- Conversion functions
- Date functions
- String functions
- Mathematical functions
- Control flow functions
- DISTINCT
- COUNT
- Character strings

:::

## Functions

### Built-in functions

![Built-in functions](../../../assets/databases/working_with_functions/built_in_functions.png)

Some common functions include aggregate functions, conversion functions, date functions, string functions, mathematical functions, and control flow and window functions.

### Example syntax

![Built-in functions: Example syntax](../../../assets/databases/working_with_functions/built_in_functions_example.png)

The `CURRENT_DATE()` function returns the current date as a value in `'YYYY-MM-DD'` format.

### Another example syntax

![Built-in functions: Another Example syntax](../../../assets/databases/working_with_functions/built_in_functions_another_example.png)

The `DATE_ADD()` function adds a time or date interval to a date and returns a value.

## Aggregate functions

### Common aggregate functions

![Common aggregate functions](../../../assets/databases/working_with_functions/common_aggregate_functions.png)

| Aggregate Function | Use Case and Example                                                                                                                                           |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **AVG**            | · Returns the average of a set<br>· Can be used to find the average population for cities within a specified country                                            |
| **COUNT**          | · Returns the number of items in a set<br>· Can be used to find the total number of cities listed within a specified country                                     |
| **MAX**            | · Returns the maximum value in a set<br>· Can be used to find the city with the greatest number or the highest population                                       |
| **MIN**            | · Returns the minimum value in a set<br>· Can be used to find the city with the smallest number or the lowest population                                        |
| **SUM**            | · Returns the total of all values in a set<br>· Can be used to find the total population for all of the cities that are listed for a specified country           |

### Example syntax

![Aggregate functions: Example syntax](../../../assets/databases/working_with_functions/aggregate_functions_example.png)

![Aggregate functions: Example syntax](../../../assets/databases/working_with_functions/aggregate_functions_example_2.png)

## Activity

![Activity](../../../assets/databases/working_with_functions/activity.png)

## `DISTINCT` keyword

### `DISTINCT` (different) keyword

![DISTINCT (different) keyword](../../../assets/databases/working_with_functions/distinct_keyword.png)

### `DISTINCT` in a `COUNT` function

![DISTINCT in a COUNT function](../../../assets/databases/working_with_functions/distinct_count_fn.png)

## Character strings and string functions

### String function: `CHAR_LENGTH()`

![String function: CHAR_LENGTH()](../../../assets/databases/working_with_functions/char_length.png)

### String function: `INSERT()`

![String function: INSERT()](../../../assets/databases/working_with_functions/insert.png)

### Leading and trailing spaces in a string

![Leading and trailing spaces in a string](../../../assets/databases/working_with_functions/leading_spaces.png)

### TRIM functions: RTRIM() and LTRIM()

![TRIM functions: RTRIM() and LTRIM()](../../../assets/databases/working_with_functions/trim_fn.png)

- The `RTRIM()` function removes blank spaces to the right of a string.
- The `LTRIM()` function removes blank spaces to the left of a string.

## Checkpoint questions

![Checkpoint questions](../../../assets/databases/working_with_functions/questions.png)

<details>
<summary>Which functions remove leading and trailing spaces on strings?</summary>
The `TRIM()` function is used to remove leading and trailing spaces from strings.
</details>

<details>
<summary>What is an aggregate function?</summary>
An aggregate function performs a calculation on a set of values and returns a single value. It is commonly used in SQL to summarize data.
</details>

<details>
<summary>What are five common aggregate functions?</summary>
Five common aggregate functions are:
- `AVG()`
- `COUNT()`
- `MAX()`
- `MIN()`
- `SUM()`
</details>


## Key Takeaways

![Takeaways](../../../assets/databases/working_with_functions/takeaways.png)

