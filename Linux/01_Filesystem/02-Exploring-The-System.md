---
tags: [linux/filesystem, linux/inspection]
sequence: 2
aliases: [exploring system, ls options, file command, less command, linux directories, filesystem hierarchy, symlinks, hard links]
moc_description: "Inspect Linux directories and files using ls/file/less, understand key filesystem hierarchy paths, and recognize symlinks vs hard links."
---

# Exploring the System (ls, file, less)
⬆️ [[Linux-MOC]]

> Scope: Inspect what exists on a Linux system with `ls`, identify file types with `file`, view text safely with `less`, and understand key filesystem hierarchy paths and link types.

## Commands introduced

| Command | Purpose | Safe example |
|---|---|---|
| `ls` | list directory contents | `ls -lah /etc` |
| `file` | identify file type by content | `file /bin/ls` |
| `less` | view text files with paging/search | `less /etc/passwd` |

## `ls` — list directory contents

### Usage patterns

```bash
ls
ls /usr
ls ~ /usr
ls -l
ls -lt
ls -lt --reverse
```

### Syntax model

```text
command  -options  arguments
   |         |         |
  ls        -l      /usr/bin
```

| Option type | Format | Example |
|---|---|---|
| short option | `-` + letter | `-l`, `-a`, `-t` |
| long option | `--` + word | `--reverse`, `--all` |
| combined short options | one `-` + multiple letters | `-lt`, `-la` |

> Gotcha: options are case-sensitive (`-l` ≠ `-L`).

### Common `ls` options

| Option | Long option | Description |
|---|---|---|
| `-a` | `--all` | include hidden entries (includes `.` and `..`) |
| `-A` | `--almost-all` | hidden entries but excludes `.` and `..` |
| `-d` | `--directory` | show the directory itself, not its contents |
| `-F` | `--classify` | append indicators (`/` dir, `*` executable, `@` symlink) |
| `-h` | `--human-readable` | human sizes (use with `-l`) |
| `-l` | *(none)* | long format |
| `-r` | `--reverse` | reverse sort |
| `-S` | *(none)* | sort by size |
| `-t` | *(none)* | sort by modification time |

### Long format: field breakdown

Example:

```text
-rw-r--r-- 1 root root 32059 2017-04-03 11:05 oo-cd-cover.odf
```

| Field | Meaning |
|---|---|
| type | `-` file, `d` directory, `l` symlink, ... |
| perms | permission bits (see [[Mode-Bits-And-Ownership]]) |
| links | hard-link count |
| owner/group | ownership |
| size | bytes (or human-readable with `-h`) |
| modified | timestamp |
| name | filename |

## `file` — identify file types by content

> Linux does not require extensions; use `file` to confirm what a file actually is.

### Usage

```bash
file /etc/passwd
file /bin/ls
file picture.jpg
```

## `less` — pager (safe file viewing)

### Usage

```bash
less /etc/passwd
less /etc/fstab
```

### Keyboard controls

| Key | Action |
|---|---|
| `Space` / `PageDown` | forward one page |
| `b` / `PageUp` | back one page |
| `g` / `1G` | start of file |
| `G` | end of file |
| `/text` | search forward |
| `n` | next match |
| `h` | help |
| `q` | quit |

> Gotcha: opening binaries in a pager can scramble the terminal. Quit with `q`; if still broken, run `reset`.

## Filesystem hierarchy (practical map)

| Path | Purpose | Notes |
|---|---|---|
| `/` | root of the whole filesystem tree | everything hangs off this via mount points |
| `/etc` | system-wide configuration | mostly text |
| `/home` | user homes | normal user-writable area |
| `/root` | root’s home | not the same as `/` |
| `/var` | variable data | logs under `/var/log` |
| `/tmp` | temp files | may be cleared on reboot |
| `/usr/bin` | most commands | modern systems often merge `/bin` into `/usr/bin` |
| `/dev` | device nodes | managed by udev |
| `/proc` | virtual procfs | kernel-generated, not on-disk |
| `/sys` | sysfs | kernel/device interface |

## Links: symbolic vs hard

### Symlink (recognize in `ls -l`)

```text
lrwxrwxrwx 1 root root 11 2025-08-11 07:34 libc.so.6 -> libc-2.6.so
```

### Symlink vs hard link

| Feature | Symbolic link | Hard link |
|---|---|---|
| Points to | path string | same inode (data) |
| Cross-filesystem | ✅ yes | ❌ no |
| Links directories | ✅ yes | ❌ no |
| If target deleted | broken link | data remains until last hard link removed |
| Typical use | shortcuts/versioning | rare, specialized |

**Verify hard links (same inode)**

```bash
ls -li file1 file2
```

## Troubleshooting

### Symptom: terminal messed up after viewing a file

**Cause:** binary data written to terminal

**Fix**

```bash
reset
```

## What NOT to do

- Don’t assume extensions imply file type; verify with `file` when it matters.
- Don’t edit files under `/proc` or `/sys` unless you understand side effects.
