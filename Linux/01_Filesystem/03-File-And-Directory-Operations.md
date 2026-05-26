---
tags: [linux/filesystem, linux/file-ops]
sequence: 3
aliases: [cp, mv, mkdir, rm, ln, copy, move, delete, links, inodes, wildcard safety, file manipulation]
moc_description: "Create, copy, move, remove, and link files/directories with mkdir/cp/mv/rm/ln, including wildcard safety and link semantics."
---

# File and Directory Operations (mkdir, cp, mv, rm, ln)
⬆️ [[Linux-MOC]]

> Scope: Core file/dir operations with safety-first patterns, plus how [[globbing]] interacts with destructive commands and how [[hard links]] vs [[symbolic links]] behave.

## Commands introduced

| Command | Purpose | Safe example |
|---|---|---|
| `mkdir` | create directories | `mkdir -p projects/app` |
| `cp` | copy files/dirs | `cp -i file1 file2` |
| `mv` | move/rename files/dirs | `mv -i old new` |
| `rm` | remove files/dirs | `rm -i file1` |
| `ln` | create links | `ln -s target link` |

## Wildcards (globbing)

> Rule of thumb: wildcards are expanded by the [[shell]] *before* the command runs. Always test expansions with `ls` first when a command can destroy data (especially `rm`).

### Wildcard characters

| Wildcard | Meaning |
|---|---|
| `*` | any characters (including none) |
| `?` | any single character |
| `[chars]` | one character from the set |
| `[!chars]` / `[^chars]` | one character NOT in the set |
| `[[:class:]]` | POSIX character class |

### POSIX character classes (portable)

| Class | Matches |
|---|---|
| `[:alnum:]` | alphanumeric |
| `[:alpha:]` | alphabetic |
| `[:digit:]` | digits |
| `[:lower:]` | lowercase |
| `[:upper:]` | uppercase |

> Gotcha: Prefer `[[:upper:]]` over `[A-Z]` because locale/collation can make `[A-Z]` behave unexpectedly.

### Globbing + hidden files

```bash
ls -a          # show dotfiles
ls .*          # includes . and .. (often not what you want)
ls .[!.]*      # dotfiles excluding . and ..
ls .??*        # dotfiles with at least 2 chars after the dot
```

## `mkdir` — create directories

### Safe examples

```bash
mkdir dir1
mkdir dir1 dir2 dir3
mkdir -p projects/app/{src,test}
```

### Dangerous patterns

> Warning: Creating directories in system paths requires privileges and can break conventions.

```bash
sudo mkdir /usr/bin/mydir   # usually wrong place for your own stuff
```

## `cp` — copy files and directories

### Syntax

```text
cp SRC DST
cp SRC... DIR/
```

### Common options

| Option | Meaning | Notes |
|---|---|---|
| `-i` | prompt before overwrite | best default when unsure |
| `-n` | no clobber (don’t overwrite) | safer for bulk copies |
| `-u` | copy only if SRC is newer / missing | update-style sync |
| `-r` | recursive | required for directories |
| `-a` | archive mode | preserves metadata; implies recursive |
| `-v` | verbose | shows what happened |

### Safe examples

```bash
cp -i file1 file2
cp -n *.conf backup/
cp -av dir1/ dir1.backup/
```

### Dangerous patterns

> Warning: `cp` overwrites silently unless you use `-i`/`-n`.

```bash
cp file1 file2   # overwrites file2 if it exists
```

## `mv` — move and rename

### Common options

| Option | Meaning |
|---|---|
| `-i` | prompt before overwrite |
| `-n` | no clobber |
| `-u` | update |

### Safe examples

```bash
mv -i file1 file2
mv -i file1 dir1/
mv -i dir1 dir2
```

> Gotcha: `mv file1 file2` replaces `file2` if it exists (it’s not a “merge”).

## `rm` — remove files/directories

> Warning: `rm` is permanent; there is no built-in undelete.

### Common options

| Option | Meaning | Risk |
|---|---|---|
| `-i` | prompt for each removal | low |
| `-I` | prompt once for many removals | medium |
| `-r` | recursive (directories) | high |
| `-f` | force (no prompts, ignore missing) | very high |

### Safe workflow (wildcards)

```bash
ls *.html
# if correct, then:
rm -i *.html
```

### Extremely dangerous

```bash
rm -rf .
rm -rf *
rm -rf /some/path
```

> Anti-pattern: running `rm -rf *` in a directory you haven’t verified with `pwd` and previewed with `ls`.

## `ln` — links

### Syntax

```bash
ln TARGET LINK        # hard link
ln -s TARGET LINK     # symbolic link
```

## Hard links (inode-based)

### Properties

| Property | Hard link |
|---|---|
| Underlying target | same [[inode]] (same data) |
| Cross-filesystem | ❌ no |
| Link directories | ❌ no |
| Survives target deletion | ✅ yes (until all hard links removed) |

### Verify hard links (same inode)

```bash
ln fun fun-hard
ls -li fun fun-hard
```

## Symbolic links (path-based)

### Properties

| Property | Symlink |
|---|---|
| Underlying target | a path string |
| Cross-filesystem | ✅ yes |
| Link directories | ✅ yes |
| Survives target deletion | ❌ no (becomes broken) |

### Relative vs absolute symlinks

| Style | Example | When to prefer |
|---|---|---|
| relative | `ln -s ../fun dir1/fun-sym` | portability when moving directories |
| absolute | `ln -s /home/me/fun dir1/fun-sym` | clarity when tree location is fixed |

> Rule of thumb: prefer relative symlinks inside a project tree; prefer absolute symlinks when the target location is truly stable.

## Troubleshooting

### Symptom: `cp` copied a directory but it’s empty

**Root cause**
- forgot recursive option

**Fix**

```bash
cp -r dir1 dir2
```

### Symptom: “cannot remove ‘dir’: Is a directory”

**Root cause**
- removing a directory without recursive flag

**Fix (dangerous)**

```bash
rm -r dir
```

### Symptom: symlink is broken (points to nothing)

**Checks (safe)**

```bash
ls -l linkname
readlink linkname
```

## What NOT to do

- Don’t use `rm -rf` unless you have verified `pwd` and previewed with `ls`.
- Don’t use `[A-Z]` ranges in globbing when portability matters; use `[[:upper:]]`.
- Don’t hard-link across filesystems (it can’t work); use a symlink instead.
