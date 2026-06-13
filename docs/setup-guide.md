# KVM Hypervisor Infrastructure Setup

## Overview
This document outlines the provisioning of the bare-metal host as a virtualization hypervisor. Due to the 120GB storage constraint on the primary OS drive, the architecture is designed to offload all virtual machine disks and ISO images to a secondary SSD storage pool.

### Hardware Context
* **Host OS:** Debian 13
* **Machine:** HP Z800 Workstation
* **Processors:** Dual Intel Xeon E5540
* **RAM:** 16 GB
* **Primary Storage:** 120 GB SSD (Host OS Only)
* **Secondary Storage:** Dedicated SSD (VM Disks & ISOs)

---

## 1. Hardware Verification
Before installing hypervisor software, verify that the host CPUs support hardware virtualization (VT-x):


```bash

egrep -c '(vmx|svm)' /proc/cpuinfo

```

*(A return value greater than 0 confirms hardware support. The dual Xeon E5540 processors returned 16 supported threads).*

**Command Breakdown:**
* **`egrep`**: Extended Global Regular Expression Print. Searches text for specific patterns.
* **`-c`**: "Count". Outputs the total number of matching lines instead of the lines themselves.
* **`'(vmx|svm)'`**: The specific pattern. `vmx` is the Intel virtualization flag; `svm` is AMD.
* **`/proc/cpuinfo`**: The virtual Linux file containing real-time CPU hardware details.

---

## 2. Core Package Installation
Install the QEMU emulator, the libvirt management daemon, networking utilities, and the graphical management interface:

```bash
sudo apt update
sudo apt install -y qemu-system-x86 libvirt-daemon-system libvirt-clients bridge-utils virt-manager
```

**Command Breakdown:**
* **`apt install`**: The Advanced Package Tool command to download and unpack software.
* **`-y`**: Automatically answers "yes" to installation prompts, which is standard practice for automation scripts.
* **`qemu-system-x86`**: The hypervisor/emulator.
* **`libvirt-daemon-system` & `libvirt-clients`**: The background management service and CLI tools (`virsh`).
* **`bridge-utils`**: Required for virtual networking.
* **`virt-manager`**: The graphical user interface for managing VMs.

---

## 3. Privilege Delegation
Allow the standard user account to manage virtual machines and interact with `libvirtd` without requiring `root` access:

```bash
sudo usermod -aG libvirt $USER
sudo usermod -aG kvm $USER
```
*(Note: A complete session logout is required for group policy changes to apply).*

**Command Breakdown:**
* **`usermod`**: Modifies user account properties.
* **`-aG`**: Append (`-a`) to Groups (`-G`). The `-a` flag is critical to prevent overwriting the user's existing group memberships.
* **`libvirt` / `kvm`**: The target security groups.
* **`$USER`**: An environment variable that automatically inputs the current logged-in username.

---

## 4. Service Management
Enable the libvirt daemon to start automatically during the host boot sequence and verify it is actively running:

```bash
sudo systemctl enable --now libvirtd
sudo systemctl status libvirtd

```
**Command Breakdown:**
* **`systemctl`**: The control command for `systemd`, managing background services.
* **`enable`**: Configures the service to start automatically on system boot.
* **`--now`**: A shortcut flag that starts the service immediately, bypassing the need for a separate `start` command.

---

## 5. Storage Architecture (Secondary SSD)
By default, KVM provisions virtual disks in `/var/lib/libvirt`. To bypass primary drive limits, the `kvm` group must be granted explicit read/write/execute permissions to the secondary drive directory:

```bash
sudo chgrp -R kvm /mnt/Daraz_SSD/linux-lab/
sudo chmod -R 775 /mnt/Daraz_SSD/linux-lab/
```
*Following this permission change, `/mnt/Daraz_SSD/linux-lab/` was successfully mounted as the primary Storage Pool in virt-manager.*

**Command Breakdown:**
* **`chgrp`**: Changes the group ownership of a file or directory.
* **`chmod`**: Changes the read/write/execute permissions.
* **`-R`**: "Recursive". Applies the changes to the target folder and all sub-folders/files within it.
* **`775`**: Octal permission notation granting full rights (7) to the Owner, full rights (7) to the Group (`kvm`), and read/execute rights (5) to Others.
