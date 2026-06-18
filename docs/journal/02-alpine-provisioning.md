# Infrastructure Log: Edge Node Provisioning (proxy-alp-01)
**Date:** 2026-06-13
**Environment:** Debian 13 Host -> KVM/libvirt -> Alpine Linux 3.24 Guest

## 1. Executive Summary
The objective was to provision a headless, lightweight edge gateway (`proxy-alp-01`) using the `virt-install` CLI. During the deployment, several hypervisor and I/O bottlenecks were encountered, requiring targeted troubleshooting to successfully commit the OS to the secondary SSD storage pool.

---

## 2. Deployment Execution & Roadblocks

### Roadblock A: Unprivileged Session Isolation
* **Symptom:** The `virt-install` command failed with `Storage pool not found: admin-lab`.
* **Root Cause Analysis:** Executing the command as a standard user defaulted the connection to the isolated user session (`qemu:///session`), which has no visibility into the system-wide storage pools created by `root`.
* **Resolution:** Explicitly declared the connection string to target the system daemon and exported it to the bash profile for future sessions.
  ```bash
  export LIBVIRT_DEFAULT_URI='qemu:///system'
  ```

### Roadblock B: Virtual Network Inactive
* **Symptom:** Provisioning aborted with `Requested operation is not valid: network 'default' is not active`.
* **Root Cause Analysis:** The libvirt installation did not set the default NAT virtual router to autostart upon host boot.
* **Resolution:** Manually initialized the network and enabled the autostart flag to ensure survivability across host reboots.
  ```bash
  virsh net-start default
  virsh net-autostart default
  ```

### Roadblock C: Severe I/O Bottleneck (Host Lockup)
* **Symptom:** During the `setup-alpine` disk formatting phase, the VNC console completely froze, requiring a manual reboot of the virtual machine.
* **Root Cause Analysis:** KVM defaulted to provisioning the virtual drive over an emulated IDE controller (`sda`). When the Alpine installer flooded the emulated controller with write requests to the physical SSD, the software translation bottleneck caused a total guest kernel lockup.
* **Resolution:** Wiped the corrupted disk and injected **VirtIO** paravirtualized drivers into the provisioning command, allowing the guest OS direct, high-speed access to the storage controller as `vda`.

---

## 3. Final Implementation

Following the resolution of the I/O bottleneck, the optimized provisioning command was executed successfully:

```bash
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
```

## 4. Verification & Handoff
The OS was successfully committed to the `vda` block device. The virtual console was detached, and a remote headless management session was established via the dynamically assigned IP from the KVM DHCP server.

```bash
# Querying the KVM router for the assigned IP
virsh net-dhcp-leases default

# Establishing remote connection
ssh sysadmin@192.168.122.141
```

![Successful SSH connection to the Alpine Gateway](../assets/images/03-alpine-ssh-success.png)
