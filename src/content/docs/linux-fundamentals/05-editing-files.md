---
title: Editing Files
sidebar: 
    badge:
        text: tbc
        variant: danger
---

![Intro](../../../assets/linux-fundamentals/editing_files/intro.png)

![What you will learn](../../../assets/linux-fundamentals/editing_files/targets.png)

In this lesson, you will learn how to:

- Explain basic commands of the Vim file editor  
- Explain basic commands of the GNU nano file editor  
- Explain basic commands of the gedit file editor

## Vim text editor
![Vim text editor](../../../assets/linux-fundamentals/editing_files/vim_text_editor.png)

This section introduces Vim and demonstrates some of the most widely used commands.

![Introduction to Vim](../../../assets/linux-fundamentals/editing_files/intro_vim.png)

Vim is an implementation of Vi. Depending on the Linux distribution, you might find Vi or Vim. A basicunderstanding if this tool is essential.

![Vim modes](../../../assets/linux-fundamentals/editing_files/vim_modes.png)

Youcan switch among the three modes as needed.

The next few slides will demonstrate some of the common commands and key strokes.

![The command mode](../../../assets/linux-fundamentals/editing_files/command_mode.png)

This list is not comprehensive.

![More Vim commands](../../../assets/linux-fundamentals/editing_files/more_vim_commands.png)

This list is not comprehensive.

![The insert mode](../../../assets/linux-fundamentals/editing_files/insert_mode.png)

Enter i.
Enter your text.
Press ESC to exit the insert mode.

![Quitting and saving](../../../assets/linux-fundamentals/editing_files/quitting_saving.png)

To save the file and exit VIM:

- Enter:
  ```bash
  :wq
  ```

![Most common Vim commands](../../../assets/linux-fundamentals/editing_files/common_vim_commands.png)

Be sure that you are comfortable with these commands, which you need to know to use Vim.

![Get help in Vim](../../../assets/linux-fundamentals/editing_files/get_help_vim.png)

`vimtutor` is a command to enter in the shell that opens a Vim documentation.  
Other commands must be entered inside Vim, such as the following:

- Press `ESC` and enter `:help` to get general help, and then enter `:q` to exit the help page.  
- Press `ESC` and enter `:help 'textwidth'` to go directly to the part of the documentation that mentions the word `textwidth`.  
  Enter `:q` to exit the documentation.  
- Enter `useradd`, press `ESC`, and enter `K` to get help about the `useradd` command.  
  Then enter `q` to exit the help page.

## GNU nano text editor

![GNU nano text editor](../../../assets/linux-fundamentals/editing_files/nano_editor.png)

Nano is another lightweight text editor that works directly from the shell.

![The GNU nano text editor](../../../assets/linux-fundamentals/editing_files/nano_editor_2.png)

On a Debian or Ubuntu distribution, you can use the following command:

```bash
sudo apt-get install nano
```

![Common nano commands](../../../assets/linux-fundamentals/editing_files/common_nano_commands.png)

The next fewslides demonstrate some common commands and key strokes.

![More nano commands](../../../assets/linux-fundamentals/editing_files/more_nano_commands.png)

This list is not comprehensive.

![Other nano commands](../../../assets/linux-fundamentals/editing_files/other_nano_commands.png)

This list is not comprehensive.Familiarize yourself with these commands.

## gedit GUI-based text editor

![gedit GUI-based text editor](../../../assets/linux-fundamentals/editing_files/gedit_editor.png)

Gedit is a graphic-basedtext editor. It requires a graphical user interface such as GNOME, Xfce, or K Desktop Environment (KDE) to be installed on the Linux distribution. It is optional.

![The gedit text editor](../../../assets/linux-fundamentals/editing_files/gedit_text_editor.png)

AWS offers instructions that guide you through the installation of a graphical user interface (GUI) on an Amazon Elastic Compute Cloud (Amazon EC2) Linux 2 instance.  
For more information about how to install a GUI on an EC2 instance running Amazon Linux 2, see:  
[https://aws.amazon.com/premiumsupport/knowledge-center/ec2-linux-2-install-gui/](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-linux-2-install-gui/)

![Checkpoint questions](../../../assets/linux-fundamentals/editing_files/questions.png)

- Because the entire Linux file system is made up of files, being able to create and update files is essential.  
- The basic skills are:
  a. Opening a file for editing (enter `vi <filename>`)  
  b. Entering insert mode (press `ESC` and then enter `i`)  
  c. Entering command mode (press `ESC`)  
  d. Saving a file (enter command mode, enter `:w`, and then press `Enter`)  
  e. Exiting `vi` (enter command mode, enter `:q`, and then press `Enter`)

![Key takeaways](../../../assets/linux-fundamentals/editing_files/takeaways.png)

Some key takeaways from this lesson include the following:

The following are the three file editors for Linux:

1. **Vim**: A command line (CLI) file editor  
2. **nano**: A command line file editor  
3. **gedit**: A GUI application for editing files  

Help and further instructions are available for each.  
For more information about gedit, see:  
[https://help.gnome.org/users/gedit/stable/](https://help.gnome.org/users/gedit/stable/)
