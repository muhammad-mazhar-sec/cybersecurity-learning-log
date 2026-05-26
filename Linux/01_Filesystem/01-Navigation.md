---
tags: [linux/filesystem, linux/navigation]
sequence: 1
aliases: [navigation, pwd, cd, ls, current working directory, cwd, directory, path, filesystem tree, absolute path, relative path]
moc_description: "Navigate the Linux filesystem tree using pwd/ls/cd, understanding CWD plus absolute vs relative paths and common shortcuts."
---

# Navigation (pwd, ls, cd)
⬆️ [[Linux-MOC]]

> Scope: How to move around the [[filesystem]] safely and predictably with `pwd`, `ls`, and `cd`, including [[current working directory|CWD]], path types, and navigation shortcuts.

## Commands introduced

| Command | Full name | Purpose | Safe example |
|---|---|---|---|
| `pwd` | Print Working Directory | Show your current location (the [[current working directory|CWD]]) | `pwd` |
| `ls` | List | List directory contents | `ls -la` |
| `cd` | Change Directory | Change the current directory | `cd /etc` |

## The filesystem tree

### Linux vs Windows (tree model)

| Feature | Linux | Windows |
|---|---|---|
| Filesystem layout | One single tree rooted at `/` | Separate tree per drive letter (`C:\`, `D:\`) |
| Root | `/` | Drive root (e.g., `C:\`) |
| Path separator | `/` | `\` |
| Storage devices | Attached via [[mount points]] inside the tree | Exposed as drive letters |

### Tree structure (typical)

```text
/                        ← root directory (top of everything)
├── home/
│   └── me/              ← your home directory (~)
│       ├── Desktop/
│       ├── Documents/
│       └── Downloads/
├── usr/
│   └── bin/             ← most system programs live here
├── etc/                 ← system configuration files
├── var/                 ← variable data (logs, etc.)
└── tmp/                 ← temporary files
```

> Gotcha: The root `/` is the single starting point for the entire Linux filesystem regardless of how many disks exist; disks appear via [[mount points]] inside the tree.

## Current working directory (CWD)

### Concept

```text
You are always "standing" inside one directory at a time.
That directory is called the Current Working Directory (CWD).
```

### `pwd`

```bash
pwd
```

- When you first log in or open a terminal, the CWD is typically your [[home directory]] (`~`).
- The prompt usually shows the current location (varies by shell configuration); verify with `pwd` when in doubt.

## Listing directory contents (`ls`)

### Basics

```bash
ls
ls /usr/bin
```

### Common safe flags

| Flag | Meaning | Notes |
|---|---|---|
| `-a` | show hidden entries (dotfiles) | includes `.` and `..` |
| `-A` | show hidden entries except `.` and `..` | often nicer than `-a` |
| `-l` | long format | shows perms/owner/size/time |
| `-h` | human-readable sizes | use with `-l` |
| `-F` | classify by type | adds `/` for dirs, `*` for executables |

Safe examples:

```bash
ls -lah
ls -lA /etc
ls -F
```

## Pathnames

### Absolute vs relative paths

| Type | Starts from | Example | Use when |
|---|---|---|---|
| Absolute path | filesystem root `/` | `/usr/bin` | you want an unambiguous location |
| Relative path | current directory (CWD) | `./bin`, `../` | you want a shorter path from where you are |

### Special path tokens

| Token | Meaning | Example |
|---|---|---|
| `.` | current directory | `cd ./bin` |
| `..` | parent directory | `cd ..` |
| `~` | your home directory | `cd ~` |
| `~username` | another user’s home | `cd ~root` *(requires permissions to access)* |

> Gotcha: `~` expansion is done by the [[shell]], not by `cd` itself. If a program doesn’t use a shell, `~` may not expand.

## `cd` (change directory)

### Absolute navigation

```bash
cd /usr/bin
pwd
```

### Relative navigation

```bash
cd ..
pwd

cd bin
pwd
```

### Useful shortcuts

| Shortcut | Result |
|---|---|
| `cd` | go to your home directory |
| `cd ~` | go to your home directory |
| `cd -` | go to the previous working directory |

### Navigation flow example

```text
Start: /home/me

cd /usr/bin      → /usr/bin        (absolute)
cd ..            → /usr            (relative, go up)
cd bin           → /usr/bin        (relative, go down)
cd               → /home/me        (home)
cd -             → /usr/bin        (previous directory)
```

## Linux filename rules (practical)

| Rule | Detail | Why it matters |
|---|---|---|
| Hidden files | names starting with `.` are hidden | `ls` won’t show them unless you use `-a`/`-A` |
| Case-sensitive | `File1` ≠ `file1` | scripts break if you get case wrong |
| Extensions optional | file type ≠ extension | use `file` (see [[02-Exploring-The-System]]) |
| Spaces in names | avoid spaces | breaks scripts; requires quoting/escaping |
| Safe punctuation | use `.` `-` `_` | portable and predictable |

> Warning: If you must handle paths with spaces, always quote: `cd "My Folder"` (see [[Quoting-And-Expansion]]).

## Troubleshooting

### Symptom: `cd`: “No such file or directory”

**Likely causes**
- typo or wrong case
- relative path from wrong CWD
- directory doesn’t exist
- missing permissions

**Checks (safe)**

```bash
pwd
ls -la
ls -ld targetdir
```

### Symptom: `ls` doesn’t show a file you know exists

**Likely cause**
- file is hidden (`.filename`)

**Check (safe)**

```bash
ls -la
ls -lA
```

## What NOT to do

- Don’t rely on the prompt to know where you are—use `pwd` before any risky command.
- Don’t create filenames with spaces unless you’re forced to.
