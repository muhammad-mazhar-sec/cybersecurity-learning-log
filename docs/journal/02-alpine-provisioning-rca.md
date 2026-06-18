# Deployment & RCA: Edge Gateway (proxy-alp-01)

**Date:** 2026-06-13

**Target:** KVM/libvirt (System URI)

## 1. Deployment Overview
Provision a headless edge proxy utilizing Alpine Linux. The deployment strictly utilizes the `virt-install` CLI to simulate automated, headless infrastructure provisioning. 

## 2. Execution Runbook
The final, stabilized command utilized to provision the gateway node to the secondary storage pool:

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

## 3. Incident Report & Root Cause Analysis (RCA)
During the initial deployment iterations, two distinct infrastructure failures occurred. 

### 3.1 Network Bridge Failure
* **Symptom:** Provisioning hard-aborted with `network 'default' is not active`.
* **Root Cause:** The `libvirtd` daemon failed to initialize the default NAT bridge (`virbr0`) on host boot.
* **Remediation:** Initialized the network and flagged it for persistent autostart.
  ```bash
  virsh net-start default && virsh net-autostart default
  ```

### 3.2 Guest I/O Lockup (Storage Controller Panic)
* **Symptom:** During the execution of the `setup-alpine` script (specifically writing the filesystem to disk), the guest VNC console entirely locked up, requiring a hard hypervisor reset (`virsh destroy`).
* **Root Cause:** KVM implicitly assigned an emulated IDE controller (`sda`) to the virtual disk. The high volume of concurrent write operations during OS installation saturated the software translation layer, causing an I/O bottleneck that locked the guest kernel.
* **Remediation:** Appended the `bus=virtio` argument to the `--disk` parameter (as seen in the final runbook command above). This exposes the disk as `vda`, utilizing paravirtualized drivers to bypass emulation and write directly to the physical storage controller.

## 4. Validation
Deployment verified via successful headless SSH session utilizing the dynamically assigned DHCP lease.

```bash
virsh net-dhcp-leases default
ssh sysadmin@192.168.122.141
```

![Edge Node SSH Validation](../assets/images/03-alpine-ssh-success.png)
