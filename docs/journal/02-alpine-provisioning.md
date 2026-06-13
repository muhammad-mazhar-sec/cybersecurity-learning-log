# Date: 2026-06-13
# Task: Provisioning the Alpine Gateway

### 1. Objective
Provision `proxy-alp-01` via the command line interface to serve as the edge gateway, bypassing GUI management tools to simulate a modern, headless data center environment.

### 2. Troubleshooting & Remediation
* **Issue 1:** `virt-install` failed to locate the `admin-lab` storage pool.
  * *Root Cause:* Command executed in the local user session (`qemu:///session`) rather than the system hypervisor.
  * *Fix:* Appended `--connect qemu:///system` to the command and exported the default URI to `~/.bashrc`.
* **Issue 2:** `Requested operation is not valid: network 'default' is not active`.
  * *Root Cause:* The KVM virtual router did not auto-start upon installation.
  * *Fix:* Executed `virsh net-start default` and `virsh net-autostart default`.
* **Issue 3:** Virtual console locked up during OS extraction to the virtual disk.
  * *Root Cause:* KVM provisioned the virtual disk as an emulated IDE controller (`sda`), creating a severe I/O software bottleneck on the host.
  * *Fix:* Modified the provisioning command to utilize the `virtio` bus (`vda`), allowing direct, high-speed access to the physical SSD controller.

### 3. Provisioning Execution
Successfully allocated a 5GB `qcow2` virtual drive on the secondary storage pool and booted the Alpine 3.24 live CD. 

\`\`\`bash
# Command Breakdown: Headless VM Provisioning

virt-install \
  --connect qemu:///system \
  --name proxy-alp-01 \
  --memory 1024 \
  --vcpus 1 \
  --disk pool=admin-lab,size=5,format=qcow2,bus=virtio \
  --cdrom /mnt/Daraz_SSD/linux-lab/Alpine/alpine-virt-3.24.0-x86_64.iso \
  --os-variant generic \
  --network network=default \
  --graphics vnc \
  --noautoconsole

  # 'virt-install': The command-line tool for provisioning new virtual machines via libvirt.
  # '--connect qemu:///system': Explicitly connects to the system-wide hypervisor daemon, bypassing the unprivileged user session.
  # '--name proxy-alp-01': Assigns the libvirt domain name (used for management commands).
  # '--memory 1024': Allocates 1024 MB (1 GB) of RAM to the guest OS.
  # '--vcpus 1': Allocates a single virtual CPU thread to the guest OS.
  # '--disk pool=admin-lab,size=5,format=qcow2,bus=virtio': 
      # 'pool': Directs creation to a specific pre-configured storage pool.
      # 'size': Defines the maximum capacity in GB.
      # 'format': Uses qcow2 for thin provisioning (only consumes physical space as data is written).
      # 'bus=virtio': Critical optimization; utilizes paravirtualized drivers to bypass IDE emulation bottlenecks.
  # '--cdrom [...]': Mounts the specified ISO image as a virtual optical drive for the initial boot.
  # '--os-variant generic': Optimizes KVM parameters for a generic Linux kernel.
  # '--network network=default': Attaches the VM to the KVM default NAT virtual router.
  # '--graphics vnc': Provisions a virtual display buffer accessible via VNC clients.
  # '--noautoconsole': Prevents virt-install from automatically attempting to launch a viewer, allowing headless background execution.
\`\`\`

### 4. Verification
After utilizing `setup-alpine` via the virtual console to commit the OS to the `vda` block device, the system was rebooted and the console was detached.

\`\`\`bash
# Command Breakdown: Remote Access Verification

# 1. Query the KVM DHCP server for the newly assigned IP address.
virsh net-dhcp-leases default
  # 'virsh': The main command-line interface for managing virsh guest domains.
  # 'net-dhcp-leases': Queries the libvirt network daemon for active DHCP leases.
  # 'default': The target virtual network to query.

# 2. Establish a remote, headless management session.
ssh sysadmin@192.168.122.141
  # 'ssh': The OpenSSH client application.
  # 'sysadmin': The target user account on the remote host.
  # '@192.168.122.141': The IP address of the target host.
\`\`\`
