---
title: Introduction to Linux
---

## Introduction to Linux

![What is Linux](../../../assets/day-6/linux.png)

### The Linux operating System

![The Linux Operating Systenm](../../../assets/day-6/linux_os.png)

Linux is an operating system that is freely distributable under the terms of the Gnu is Not Unix (GNU) General Public License (GPL). It is open source because it provides the source code for the core functionality of an operating system, called a **kernel**, and users can modify and expand it. As a result, many **distributions** of Linux are available today.

With Linux, multiple people can use the same computer at the same time and can run multiple applications simultaneously. It also supports network functionality and provides system tools and utilities to increase usability.

#### Linux history and benefits

![Linux History and Benefits](../../../assets/day-6/linux_history.png)

Linus Torvalds, a graduate student at the University of Helsinki in Finland, created Linux in 1991. Linux is similar to another operating system that is called Unix, which was developed in the late 1960s. In addition to being open source, Linux is modular, which means that you can extend it. It is also stable and does not experience frequent system freezes that require computer restarts. Because of these benefits, you can use Linux both as a desktop system and a server operating system.

#### Distributions

![Distributions](../../../assets/day-6/distros.png)

A Linux distribution is a packaged version of Linux that a group of individuals or a company develops. It includes the core operating system functionality (kernel) and additional complementary tools and software applications. Distributions are typically downloaded but can also be installed by using various media and formats. Examples include compact disk (CD), Universal Serial Bus (USB) device, and downloadable International Standardization for Organization (ISO) image. Examples of Linux distribution include Amazon Linux 2, Red Hat Enterprise Linux (RHEL), Debian, and Ubuntu. In the AWS Cloud, the Amazon Linux 2 operating system is readily distributed by using an Amazon Machine Image (AMI). An AMI contains an operating system and other pre-installed software relevant to the image. You will learn more about Amazon Linux 2 in a later section.

#### Major components of Linux

![Major Components if Linux](../../../assets/day-6/components.png)

The major components of a Linux distribution consist of a kernel, daemons, applications, data files, and configuration files. You will review them in more detail in the next slides.

### The Linux kernel

![The Linux Kernel](../../../assets/day-6/kernel.png)

The kernel refers to the core component of an operatingsystem. It controls everything in the operatingsystem, including the allocation of CPU time and memory storage to running programs, and access to peripheral devices.

#### Functions of the Linux kernel

![Functions of the Linux Kernel](../../../assets/day-6/functions.png)

The Linux kernel manages the running of multiple applications and the sharing of resources among multiple users. It also controls the interface to the input/output (I/O) devices that are connected to the computer, and it manages files and directories.

#### Daemons

![Daemons](../../../assets/day-6/daemons.png)

A daemon is a computer program that runs in the background and is not under the control of an interactive user. It typically provides a service to other running programs. Examples of daemons include the following:

- **syslogd**: When system or user applications generate messages, the `syslogd` daemon captures the messages and stores them to a file, which is called a log.
- **sshd**: The `sshd` daemon handles Secure Shell (SSH) connections to the computer. This type of connection uses encryption to secure the communication between the client and the server.

You will learn more about daemons in the Managing Processes lesson.

#### Applications

![Applications](../../../assets/day-6/apps.png)

An application, is a computer program that provides functions that help users perform a type of task or activity. For example, with a word processor app, users can create and edit text content, and this type of app facilitates document authoring and modification. Likewise, with a web browser app, userscan access the internet and visit websites.  

#### Data files

![Data files](../../../assets/day-6/data.png)

A file contains information, or data, that the user has created or captured. Files can be of different types depending on the type of data that they contain. A program can process the data in a file. Examples of data files include music, text, or image files. Files are also typically grouped in directories for organizational purposes. A file has a name that uniquely identifies it. The format of a complete file name consists of an optional directory name, the actual file name, and an optional extension. A period precedes the extension. In the last file name example that is shown:

- `/pictures` is the directory name.
- `dog` is the file name.
- `.gif` is the extension.

#### Configuration files

![Configuration files](../../../assets/day-6/config.png)

A Linux configuration file is a special type of file that stores initial settings or important values for a system program. These values configure the behavior of the associated program or capture the data that the program uses. For example, the `/etc/group` configuration file contains the list of authorized users for the system. Some configuration files are used to run a set of commands when the system is started or when the user logs in. With these commands, the Linux environment can be customized to the specific preferences of the user. Configuration file names use a common set of extensions, including `.cnf` and `.conf`.

#### How to interface: CLI compared with GUI

![How to interface: CLI compared with GUI](../../../assets/day-6/cli_vs_gui.png)

You can use either the CLI or GUI based on your preference.

#### The shell

![The shell](../../../assets/day-6/shell.png)

When you use the CLI, the **shell** that you select defines the list of commands and functions that you can run. A shell interprets the command that you type and invokes the appropriate kernel component that runs the command. You can use many types of shells, and each Linux distribution defines the types that it can support.

#### Shell types

![Shell types](../../../assets/day-6/shell_types.png)

There are different shell types, but the only one you need to know for Linux is the Bash Shell. An upcoming lesson will detail how to use the Bash Shell.

### Linux Documentation

#### Manual Pages

![Manual Pages](../../../assets/day-6/manual.png)

The primary source of Linux documentation is the manual pages. They contain a description of the purpose, syntax, and options for a Linux command.

When you ask a Linux person for help, the most likely first answer that you will get is, “Did you check the man pages?”

You access the `man` pages by using the mancommand.

#### The man command

![The man command](../../../assets/day-6/man_command.png)

The `man` command displays documentation information for the command that you specify as its argument. This information includes the following:

- **Name:** The name and a brief description of the purpose of the command
- **Synopsis:** The syntax of the command
- **Description:** A detailed description of the command’s usage and functions
- **Options:** An explanation of the command’s options

The example screen capture shows the output of the `man` command.

#### Command features of the `man` command

![Command features of the man command](../../../assets/day-6/command_features.png)

Using the `man` command, you can determine the syntax of a particular command. It is also very useful in understanding a command’s options. The documentation that is displayed for a command will typically consist of many pages. To navigate through the pages, use the following keyboard keys:

- **Up arrow** or **Down arrow** key: Scrolls up or down one line, respectively
- **Page-up** or **Page-down** key: Scrolls up or down one page, respectively
- **Space bar:** Scrolls down one page

You can also search a command’s man page by using the forward slash (/) character: `/<searchString>`

To exit the manual pages, enter `q`.

### Linux distributions

#### Sources of major distributions

![Sources of major distros](../../../assets/day-6/major_distros.png)

A Linux distribution includes the Linux kernel and the tools, libraries, and other software applications that the vendor has packaged. Most widely used distributions are derived from the following sources:

- **Fedora:** Red Hat, an IBM company, mainly sponsors this distribution. Fedora is used to develop, test, and mature the Linux operating system. Fedora is the source of the commercially distributed RHEL from which the Amazon Linux 2 and CentOS distributions are derived.
- **Debian:** This Linux distribution adheres strongly to the free software principles of open source. The Ubuntu distribution is derived from Debian, and the British company Canonical Ltd. maintains it.
- **OpenSUSE:** The German company SUSE sponsors this distribution, which is used as the basis for the company’s commercially supported SUSE Enterprise Linux offering.

#### Amaxon Linux 2

![Amazon Linux 2](../../../assets/day-6/amazon_linux2.png)

Amazon Linux 2 is the latest Linux operating system that AWS offers. It is designed to provide a stable, secure, and high-performance runtime environment for applications that run on Amazon Elastic Compute Cloud (Amazon EC2). It supports the latest EC2 instance type features and includes packages that facilitate integration with AWS.

Amazon Linux 2 enhances security by automatically applying critical or important security updates when an instance is booted. For more information on Amazon Linux 2, see [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/).

#### CentOS

![CentOS](../../../assets/day-6/cent_os.png)

CentOS (or Community Enterprise Operating System)is a free Linux distribution and is functionally compatible with its upstream source, RHEL.

CentOS is currently used in the lab environment for this course.

As of December 2020, Red Hat has cancelled any further development for CentOS Linux and replaced it with CentOS Stream.

### Connecting to a remote Linux server

#### Lab environment

![Lab Environment](../../../assets/day-6/lab_env.png)

You will connect to Vocareum to work on your labs. The interface offers all the lab information and steps, as well as buttons to start the AWS instance you will work with.

- The **Start Lab** button will generate your AWS working environment.
- The **Details** pane displays information such as the IP address of the EC2 instance that you will work with. It also provides the URL to download the private SSH connection key.
- The **AWS** button opens the AWS console. While you won't need to access this console when working on the Linux labs, you should familiarize yourself with it for future use.

#### Lab architecture

![Lab architecture](../../../assets/day-6/lab_arch.png)

When you start working on your labs, an Amazon Linux 2 EC2 instance instantiates automatically. You will download a key to securely connect to this instance using Secure Shell (SSH) with the user `ec2-user`. SSH is a network protocol that provides a secure way to access a computer. To connect to a host via SSH:

- On MacOS or Linux, you can typically access an SSH client directly from the terminal.
- On Windows, you can use a tool called PuTTY, which provides a graphical interface.

SSH connections usually use port 22. The security group linked to the EC2 instance automatically opens this port.

#### Additional details

![Additional details](../../../assets/day-6/additional_details.png)

On Windows. PuTTY uses a slightly different format, the.ppk (which stands for PuTTY private key) format. PuTTYgenis a tool that can convert a .pem key into a .ppk key.Both .pem and .ppk keys are provided in the lab.

#### How to access Linux AMI

![How to access Linux AMI](../../../assets/day-6/access_linux_ami.png)

After launching an EC2 instance, you can connect to it and use it as you would with a computer in front of you. Depending on your operating system, there are two ways to access the EC2 instance:

- **Using PuTTY (Windows):** PuTTY is an open-source SSH and telnet client that allows you to connect to your instance from a Windows machine.
  
- **Using SSH (macOS/Linux):** If you are using a macOS or Linux machine, it likely includes an SSH client by default. You can check for the SSH client by entering `ssh` at the command line.

#### Checkpoints questions

![Checkpoint questions](../../../assets/day-6/questions.png)

What is a Linux distribution?

- A Linux distribution is a packaged version of Linux that a group of individuals or a company develops. It includes the core operating system functionality (kernel) and additional complementary tools and software applications.

True or false: The bash shell is the default shell for most Linux distributions.

- True

Which command provides help for Linux commands?

- `man`

### Key Takeaways

![Key Takeaways](../../../assets/day-6/takeaways.png)

Some key takeaways from this lesson include:

- Linux is an operating system that is similar to Unix. It is free and open source, and users can expand it.
- A Linux distribution combines the Linux kernel with other software applications to provide a complete operating system environment.
- All Linux distributions come with a CLI. Some also offer a GUI.
- The bash shell is the default shell in Linux.
- You can use the `man` command to read the Linux manual pages.
