# Deployment Log: Phase 2 - Network & Access Mesh (Day 2 Operations)
**Date:** 2026-06-19
**Engineer:** M. Mazhar
**Objective:** Transition from isolated graphical hypervisor consoles to a unified, headless SSH mesh with static IP routing.

## 1. Phase Overview
To support enterprise automation (Ansible) and container orchestration, the dynamic DHCP leases provided by the KVM hypervisor were replaced with hardcoded static IPs. A Zero-Trust, passwordless SSH mesh was established using Elliptic Curve Cryptography (`ed25519`).

## 2. Cryptographic Access Baseline
A master SSH key pair was generated on the main host machine to establish passwordless authentication across the fleet.

* **Algorithm:** `ed25519` (Selected over RSA for faster processing and smaller key size while maintaining higher brute-force resistance).
* **Key Distribution:** Public keys were injected into the `~/.ssh/authorized_keys` file of standard administrative users on each node via the `ssh-copy-id` automation script.

## 3. Node-Specific Network Engineering

### Core Infrastructure Node (`infra-deb-01`)
* **IP Address:** `192.168.122.254/24`
* **Configuration Engine:** Standard `/etc/network/interfaces`
* **Incident Report (Ghost Lease):** Upon restarting the networking service, the node retained its original DHCP lease (`.253`) alongside the new static IP (`.254`). A full system power cycle was initiated to explicitly kill the background `dhclient` process and validate the permanence of the static configuration.

### Identity Management Node (`auth-rhel-01`)
* **IP Address:** `192.168.122.230/24`
* **Configuration Engine:** NetworkManager (`nmcli`)
* **Incident Report (Safety Catch):** Attempting to switch the IPv4 method to `manual` before defining a static IP triggered a NetworkManager safety override. The IP address had to be committed to the profile first before the DHCP daemon could be disabled.
* **Security Enforcement:** The standalone `root` account was permanently disabled (`passwd -l root`) via the `/etc/shadow` file to enforce a Zero-Trust architecture. All administrative actions must now be executed via the `sysrhel` user using `sudo` elevation.

### Container Orchestration Node (`cntr-ubu-01`)
* **IP Address:** `192.168.122.89/24`
* **Configuration Engine:** Canonical Netplan (YAML)
* **Incident Report (YAML Strictness):** Initial deployment of the Netplan configuration failed due to strict indentation parsing errors in the `routes` and `nameservers` arrays. The YAML file was refactored to enforce exact 2-space parent-child hierarchical alignment, resulting in a successful `netplan apply`.

## 4. Operational Status
Graphical VNC access (`virt-viewer`) has been officially deprecated. All nodes are now managed headlessly via standard terminal SSH connections. The network is primed for application and orchestration deployments.
