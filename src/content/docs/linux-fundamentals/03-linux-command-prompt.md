---
title: Linux Command Prompt
---
![Linux command prompt](../../../assets/day-6/command_prompt.png)

## Anatomy of the command prompt

![Anatomy of the command propt](../../../assets/day-6/anatomy.png)

The default shell in Linux is Bash, which provides the command prompt. The Linux command prompt or command line is a text interface to your Linux computer. It is commonly referred to as the shell, terminal, console, or prompt. The default shell contains the user name, and the user's home directory has the same name as the user (which it does by default). Although this format is common, it is changeable and not always consistent in different Linux distributions.

## Command syntax example

![Command syntax esample](../../../assets/day-6/command_example.png)

The command syntax is case-sensitive. Most commands in Linux follow syntax rules. Depending on the command, the syntax comprises the command itself, an option, and an argument. If you review the example above, this structure is reflected.

The best way to describe the command syntax is as follows:

- **Command:** What you want Linux to do
- **Option:** Modifies the command
- **Argument:** What the command acts on

For example, consider the analogy of a car. If you drive a car, drive would be the command. An option could be noted as turn on the headlights, and the argument is a car.

To reinforce this concept, a car was used as an example:

- **The command** is drive.
- **An option** is to turn on the headlights.
- **The argument** is a car.

Reference: Image of Tux made by Larry Ewing (lewing@isc.tamu.edu) by using The GIMP.

## The `whoami` command

![The 'whoami' command](../../../assets/day-6/whoami.png)

The concatenation of the strings *who*, *am*, and *i* is *whoami*. In Linux, it's used to show the current user's user name when the command is invoked. A use case for this command would be to use it after you log in as UserA. Then, switch users and run commands as another user to see the context.

## The `id` command

![The 'id' command](../../../assets/day-6/id_command.png)

This command helps identify the user and group name and numeric IDs (UID or group ID) of the current user or any other user on the server. This command displays the user and group information for each specified USER or (when USER is omitted) for the current user.

## The `hostname` command

![The 'hostname' command](../../../assets/day-6/hostname.png)

This command displays the TCP/IP hostname. The hostname is used to either set or display the system's current host, domain, or node name. Many networking programs use hostnamesto identify the system.

## The `uptime` command

![The 'uptime' command](../../../assets/day-6/uptime.png)

This command indicates how long the system has been up since the last boot.

## The `date` command

![The 'date' command](../../../assets/day-6/date.png)

This command can display the current time in a given forma.It can also set the system date.

## The `cal` command

![The 'cal' command](../../../assets/day-6/cal.png)

The `cal` command is used to display a calendar. If no arguments are specified, the current month is displayed. Note: The month can be specified as a number (1–12), a month name, or an abbreviated month name according to the current locales.

## The `clear` command

![The 'clear' command](../../../assets/day-6/clear.png)

The `clear` command is used to clear the terminal screen. This command, when ran, clears all text on the terminal screen and displays a new prompt.

## The `echo` command

![The 'echo' command](../../../assets/day-6/echo.png)

The `echo` command places specified text on the screen. It is useful in scripts to provide users with information as the script runs. It directs selected text to standard output or in scripts to provide descriptions of displayed results.

## The `history` command

![The history command](../../../assets/day-6/history.png)

Bash keeps a history of each user's commands in a file in that user's home directory. The `history` command views the history file.

- It displays the current user's history file.
- Up and down arrow keys cycle through the output or the history file.
- This command can be run by using an event number: for example, `!143`.

Note: If you make a mistake when writing a command, don't reenter it. Use the `history` command to call the command back to the prompt, and then edit the command to correct the mistake.

You should use the `history` command in the following use cases:

- Accessing history between sessions
- Removing sensitive information from the history: for example, a password that is entered into a command argument

## The `touch` command

![The touch command](../../../assets/day-6/touch.png)

The `touch` command can be used to create, change, or modify timestamps on existing files. Also, the `touch` command is used to create a new empty file in a directory.

To create a new file by using the `touch` command, enter `touch file_example_1`

You can use the `touch` command to generate more than one new file at a time, by writing the syntax `touch file_example_1 file_example_2 file_example_3`

Note: You see the `ls` command in the screenshot. You'll learn more about the `ls` command in the next lesson.

## The `cat` command

![The cat command](../../../assets/day-6/cat.png)

The `cat` command is used to show the contents of files. This command is useful to administrators because Linux configurations are held in text files.

In the example that is shown, you can use this command to view the contents of the `hosts.allow` file.

## Additional commands

Standard streams are interconnected input and output communication channels. There are three input/output (I/O) streams. The standard streams are:

- **#0 Standard in (`stdin` command)**
- **#1 Standard out (`stdout` command)**
- **#2 Standard error (`stderr` command)**

These communication channels handle incoming data or outgoing data from an input device or write data from applications. In modern operating systems, the standard error stream is redirected to log files.

### Standard input - `stdin` command

![Standard input stdin command](../../../assets/day-6/stdin.png)

Standard input is the file handle that your process reads to get information from you. It can be from the user who provides the information or from a file.

- **Standard input:** `0`

The example `cat 0<myfirstscript` tells `cat` to take input information from `myfirstscript`. `0` is the value that is used for standard input. `<` redirects the content of `myfirstscript` to the standard input.

### Standard output - `stdout` command

![Standard output stdout command](../../../assets/day-6/stdout.png)

Standard output consists of the standardized streams of data that flow out of command line interface (CLI) commands. It simplifies the use of Linux on different devices and in different programs. It reduces the need to adjust output depending on the device that is used.

- **Standard output:** `1`

Consider the command: `ls -l > folder.txt`

`ls -l` lists the content of the current folder. Instead of displaying it on the console, the output of the `ls` command is directed to the file `folder.txt`.

### Standard error - `stderr` command

![Standard error stderr command](../../../assets/day-6/stderr.png)

Standard error (stderr) is used to print error messages on the output screen or terminal window.

- **Standard error (stderr):** `2`

For example, consider the command: `find / -name "*" -print 2> /dev/null`

This command discards any errors that the `find` command generates to keep your CLI tidy.

### Bash tab completion

In Bash tab completion, the tab key automatically completes commands and file or directory names. The Bash tab saves time and provides greater accuracy. To use this feature, you must enter enough of the command or file name for it to be unique.

### Best practice: History and tab completion

![Best practice: History and tab completion](../../../assets/day-6/best_practice.png)

For history and Bash tab completion, best practices include the following:

- **Develop the habit of using both of these features to make usage of the command line faster.**
- **Use the features of Bash to work smarter, not harder.**

## Checkpoint questions

![Checkpoint questions](../../../assets/day-6/checkpoint_questions.png)

Be sure that you can answer these key questions about this content:

1. **Command, Option, Argument**

2. **The history command**
   Example: [c_salazar@hostname ~]$ history

3. **You will be shown all possible options if you press tab twice.**

## Key Takeaways

![Key Takeaways](../../../assets/day-6/key_takeaways.png)
:::tip[Recap]
Some key takeaways from this lesson include the following:

- The Linux login workflow consists of the following three main steps:
  - The user is prompted to authenticate with a user name and password.
  - The user’s session settings are loaded from the user’s profile files.
  - The user is presented with a command prompt in the user’s home directory.
- You can use the `tab` key to automatically complete commands at the command prompt.
- Some useful Linux commands include `history`, `whoami`, and `hostname`.

:::