---
title: Linux Commands
---
1. **File Operations:**
   - `ls`: Lists all files and directories in the present working directory
   - `ls -R`: Lists files in sub-directories recursively
   - `ls -a`: Shows hidden files
   - `ls -al`: Lists files and directories with detailed information
   - `cd directoryname`: Changes the directory
   - `cd ..`: Moves one level up
   - `pwd`: Displays the present working directory
   - `cat > filename`: Creates a new file
   - `cat filename`: Displays the file content
   - `cat file1 file2 > file3`: Joins two files and stores output in a new file
   - `touch filename`: Creates or modifies a file
   - `rm filename`: Deletes a file
   - `cp source destination`: Copies files from source to destination
   - `mv source destination`: Moves files from source to destination
   - `find / -name filename`: Finds a file or directory by name starting from root
   - `file filename`: Determines the file type
   - `less filename`: Views file content page by page
   - `head filename`: Views first ten lines of a file
   - `tail filename`: Views last ten lines of a file
   - `lsof`: Shows which files are opened by which process
   - `du -h --max-depth=1`: Shows size of each directory (limit to current directory)
   - `fdisk`: Disk partition manipulation command

2. **Directory Operations:**
   - `mkdir directoryname`: Creates a new directory in the present working directory
   - `rmdir directoryname`: Deletes a directory
   - `cp -r source destination`: Copies directories recursively
   - `mv olddir newdir`: Renames directories
   - `find / -type d -name directoryname`: Finds a directory starting from root

3. **Process Operations:**
   - `ps`: Displays currently active processes
   - `top`: Displays all running processes
   - `kill pid`: Kills process with given PID
   - `pkill name`: Kills process with given name
   - `bg`: Resumes suspended jobs in background
   - `fg`: Brings most recent job to foreground
   - `fg n`: Brings job n to foreground
   - `renice +n [pid]`: Change priority of a running process
   - `&>filename`: Redirects both stdout and stderr to file
   - `1>filename`: Redirects stdout to file
   - `2>filename`: Redirects stderr to file

4. **File Permissions:**
   - `chmod octal filename`: Change permissions of file to octal (0-7)
   - `chown ownername filename`: Change file owner
   - `chgrp groupname filename`: Change group owner

5. **Networking:**
   - `ping host`: Ping a host and output results
   - `whois domain`: Get WHOIS information for domain
   - `dig domain`: Get DNS information for domain
   - `netstat -pnltu`: Display network related information
   - `ifconfig`: Displays IP addresses of network interfaces
   - `ssh user@host`: Remote login into host as user
   - `scp`: Transfers files between hosts over SSH
   - `wget url`: Download files from the web
   - `curl url`: Sends request to URL and returns response
   - `traceroute domain`: Prints route that a packet takes to reach domain
   - `mtr domain`: Combines functionality of traceroute and ping
   - `ss`: Investigates sockets
   - `nmap`: Network exploration tool and security scanner

6. **Archives and Compression:**
   - `tar cf file.tar files`: Create tar archive containing files
   - `tar xf file.tar`: Extract files from tar archive
   - `gzip file`: Compress file and rename to file.gz
   - `gzip -d file.gz`: Decompress file.gz to file
   - `zip -r file.zip files`: Create zip archive named file.zip
   - `unzip file.zip`: Extract contents of zip file

7. **Text Processing:**
   - `grep pattern files`: Search for pattern in files
   - `grep -r pattern dir`: Search recursively for pattern in dir
   - `echo 'text'`: Prints text
   - `sed 's/string1/string2/g' filename`: Replaces string1 with string2 in filename
   - `diff file1 file2`: Compares two files and shows differences
   - `wc filename`: Count lines, words, and characters in a file
   - `awk`: Versatile programming language for working on files
   - `sed -i 's/string1/string2/g' filename`: Replace string1 with string2 in filename (edits file in-place)
   - `cut -d':' -f1 /etc/passwd`: Cut out first field of each line in /etc/passwd using colon as delimiter

8. **Disk Usage:**
   - `df`: Shows disk usage
   - `du`: Shows directory space usage
   - `free`: Show memory and swap usage
   - `whereis app`: Show possible locations of app

9. **System Info:**
   - `date`: Show current date and time
   - `cal`: Show current month's calendar
   - `uptime`: Show current uptime
   - `w`: Display who is online
   - `whoami`: Who you are logged in as
   - `uname -a`: Show kernel information
   - `df -h`: Disk usage in human readable format
   - `du -sh`: Disk usage of current directory in human readable format
   - `free -m`: Show free and used memory in MB

10. **Package Installations:**
    - `sudo apt-get update`: Updates package lists for upgrades
    - `sudo apt-get upgrade`: Upgrades all upgradable packages
    - `sudo apt-get install pkgname`: Install pkgname
    - `sudo apt-get remove pkgname`: Removes pkgname

11. **Other Commands (used in scripts):**
    - `command1 ; command2`: Run command1 and then command2
    - `command1 && command2`: Run command2 if command1 is successful
    - `command1 || command2`: Run command2 if command1 is not successful
    - `command &`: Run command in background

12. **Version Control (Git commands):**
    - Git commands: Various commands for version control operations

13. **Environment Variables:**
    - `env`: Display all environment variables
    - `echo $VARIABLE`: Display value of an environment variable
    - `export VARIABLE=value`: Set value of an environment variable
    - `alias new_command='old_command options'`: Create new command that executes old command with options
    - `echo $PATH`: Print the PATH environment variable
    - `export PATH=$PATH:/new/path`: Add /new/path to the PATH

14. **Job Scheduling (Cron Jobs):**
    - `crontab -l`: List all your cron jobs
    - `crontab -e`: Edit your cron jobs
    - `crontab -r`: Remove all your cron jobs
    - `crontab -v`: Display last time you edited your cron jobs
    - `crontab file`: Install a cron job from a file
    - `@reboot command`: Schedule a job to run at startup

15. **Package Installations (using pip):**
    - `pip install packagename`: Install a Python package
    - `pip uninstall packagename`: Uninstall a Python package
    - `pip freeze > requirements.txt`: Freeze installed packages into requirements file
    - `pip install -r requirements.txt`: Install packages from requirements file

16. **Shell Scripting:**
    - Shell scripting commands and constructs

17. **System Monitoring and Performance:**
    - `iostat`: Reports CPU and I/O statistics
    - `vmstat`: Reports information about processes, memory, etc.
    - `htop`: Interactive process viewer
    - Others related to system monitoring and performance

18. **Search and Find:**
    - Commands related to searching and finding files

19. **Compression / Archives:**
    - Commands related to compression and archives

20. **Disk Usage:**
    - Commands related to disk usage

21. **Others:**
    - Miscellaneous commands and cautionary commands
