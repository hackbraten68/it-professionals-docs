---
title: Managing Linux File Permissions
---
You will learn how to:

- View and change file permissions
- Compare symbolic and absolute representations of file permissions

## Linux permission types

![Linux permission types](../../../assets/day-8/permission_types.png)

In Linux, the term **permissions** refers to how someone can use a file or directory. Files and directories in a Linux system have the following three permissions:

- **Read**: The read permission allows opening and reading a file. For example, having read permission on a directory allows printing out the file's content.
- **Write**: The write permission allows changing the file's content. For example, having write permission on a directory allows adding, removing, and renaming files stored in the directory. A user might have write permission on a file within a directory but not on the directory itself. In that case, the user can change the file contents but cannot rename or remove the file from the directory.
- **Execute**: This permission is required in Linux to run a program. Without execute permission, a user can view or modify the program code (if read and write permissions are set), but cannot execute it.

### Permission modes

![Permission modes](../../../assets/day-8/permission_modes.png)

Linux uses two modes to configure permissions. You must be able to interpret and use both modes, though you might prefer one over the other.

The two modes are:

- **Absolute mode**: Uses numbers to represent file permissions. This mode is the most commonly used to set permissions.
- **Symbolic mode**: Uses a combination of letters and symbols to add permissions or to remove any set permissions.

Note: With the `chmod` command, the user can change the permissions on a file. You must be a superuser or the owner of a file or directory to change its permissions.

### Using the `ls -l` command to view permissions

![Using the ls -l command to view permissions](../../../assets/day-8/view_permissions.png)

The `ls -l` command is used to print out (view) detailed information about a file or directory's permissions. The option `-l` displays the file or directory's size, modified date and time, file or folder name, owner of the file, and its permissions.

When this command is used, you will see a list of various essential file attributes that include information about file permissions.

### Understanding the differences

![Understanding the differences](../../../assets/day-8/differences.png)

Files and directories in a Linux system assign three types of ownership. The three ownership types are as follows:

**Note**: A user is the owner of the file. Every file in the system belongs to precisely one user name, which is also called the file owner.

- **User**: A user can create a new file or directory. The file's ownership is set to the user ID of the user who created the file.
- **Group**: A user group can contain multiple users. Users who belong to that group will have the same Linux group permissions to access the file. Every file is also associated with one group name, which is called the group owner.
- **Other**: Other ownership means that the user did not create the file and does not belong to a user group that could own the file.

In the following few slides, you will look at permissions in Linux.

### User or owner identity

![User or owner identity](../../../assets/day-8/user_owner.png)

The owner of the file is displayed to the right of where the permissions are displayed. The file owner controls permissions, and the permissions are set for the owner and apply to that user identity or name.
