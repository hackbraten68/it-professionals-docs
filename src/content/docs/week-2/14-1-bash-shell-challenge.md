---
title: Challenge Bash Shell Script
---

## Script Code

```bash
#!/bin/bash

# Set your name here
yourName="Samuel"

# Find the maximum existing number
maxNum=$(ls ${yourName}* 2>/dev/null | sed "s/${yourName}//" | sort -n | tail -n 1)

# If no files exist, start from 0
if [ -z "$maxNum" ]; then
    startNum=0
else
    startNum=$((maxNum + 1))
fi

# Create 25 new files
for i in {0..24}; do
    touch "${yourName}$((startNum + i))"
done

# Display the directory contents
ls -l ${yourName}*
```

## Command Explanation

```bash
#!/bin/bash
maxNum=$(ls ${yourName}* 2>/dev/null | sed "s/${yourName}//" | sort -n | tail -n 1)
```

This command finds the maximum existing number in filenames. Let's break it down:

1. `$(...)`: Command substitution. Runs the commands inside and returns the output.

2. `ls ${yourName}*`:
   * Lists all files starting with the value of `yourName`
   * `*` is a wildcard matching any characters after `yourName`

3. `2>/dev/null`:
   * Redirects error messages (stderr) to /dev/null
   * Silences errors if no matching files exist

4. `|`: Pipe operator. Feeds output of previous command as input to the next.

5. `sed "s/${yourName}//"`:
   * Uses `sed` to substitute `yourName` with nothing
   * Effectively removes `yourName` from each filename

6. `sort -n`:
   * Sorts the remaining numbers numerically
   * `-n` flag ensures numeric sort

7. `tail -n 1`:
   * Takes the last line of the sorted output
   * This will be the highest number

8. The result is assigned to the variable `maxNum`

### Summary

This command:

* Lists files starting with `yourName`
* Removes `yourName` from filenames, leaving only numbers
* Sorts these numbers
* Selects the highest number

This allows the script to find the highest existing number among the files, determining where to start creating new files.

```bash
#!/bin/bash
if [ -z "$maxNum" ]; then
    startNum=0
else
    startNum=$((maxNum + 1))
fi
```

### Determining the Starting Number

This code block determines the starting number for creating new files. Let's break it down:

1. `if [ -z "$maxNum" ]; then`
   * The `-z` test checks if the string length of `$maxNum` is zero
   * This condition is true if `$maxNum` is empty (i.e., no files exist yet)

2. `startNum=0`
   * If the condition is true (no files exist), set `startNum` to 0
   * This ensures we start numbering from 0 when creating the first batch of files

3. `else`
   * This block executes if the condition is false (i.e., some files already exist)

4. `startNum=$((maxNum + 1))`
   * `$((...))` is arithmetic expansion in Bash
   * It adds 1 to the value of `maxNum`
   * This ensures we start numbering from the next available number

5. `fi`
   * Closes the if-else statement

### Purpose

This code handles two scenarios:

1. When no files exist yet:
   * `$maxNum` will be empty
   * We start creating files from number 0

2. When files already exist:
   * `$maxNum` contains the highest existing number
   * We start creating files from the next number (highest + 1)

This approach ensures that each time the script runs, it creates a new batch of files with incrementing numbers, without overwriting existing files.

### Creating 25 new Files

```bash
#!/bin/bash
for i in {0..24}; do
    touch "${yourName}$((startNum + i))"
done
```

This for loop creates 25 new files. Let's break it down:

1. `for i in {0..24}; do`
   * This is a Bash for loop that iterates 25 times (from 0 to 24)
   * `{0..24}` is Bash's brace expansion, creating a sequence from 0 to 24
   * `i` is the loop variable that takes on each value in the sequence

2. `touch "${yourName}$((startNum + i))"`
   * `touch` is a command that creates an empty file or updates the timestamp of an existing file
   * `"${yourName}..."` constructs the filename:
     * `${yourName}` is the variable containing the base name
     * `$((startNum + i))` is arithmetic expansion:
       * `startNum` is the starting number we calculated earlier
       * `i` is the current loop iteration (0 to 24)
       * This creates a unique number for each file

3. `done`
   * Marks the end of the for loop

This loop accomplishes several things:

1. Creates exactly 25 files in each run of the script
2. Names each file with the pattern `<yourName><number>`
3. Ensures each file has a unique number by:
   * Starting from `startNum` (which is either 0 or the next available number)
   * Adding the loop index (0 to 24) to create 25 consecutive numbers

This approach allows the script to create a new batch of 25 files each time it runs, with numbers that continue from where the last batch left off.
