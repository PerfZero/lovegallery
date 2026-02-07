# Deploying to VPS (85.198.101.110)

This guide outlines the steps to deploy the `beloved-nextjs` application to your new server.

## 1. Initial Access & SSH Key
To enable SSH access and copy your key (`id_rsa_vps.pub`) to the server so you don't have to enter the password every time, run this command from your **local terminal** (Git Bash or PowerShell):

```bash
# Copy your SSH key to the server
ssh-copy-id -i ~/.ssh/id_rsa_vps.pub root@85.198.101.110
# (Enter the password one last time: k!+H2pcMUM9j)
```

If `ssh-copy-id` is not available, you can use this command instead:
```bash
cat ~/.ssh/id_rsa_vps.pub | ssh root@85.198.101.110 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 2. Install Docker on Server
Once logged in (`ssh root@85.198.101.110`), run these to prepare the environment:

```bash
# Update and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose-v2
```

## 3. Transfer Project Files
From your **local terminal** (inside the project folder):

```bash
# Using rsync to copy the project (recommended)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ root@85.198.101.110:/root/beloved-nextjs/
```

## 4. Launch Application
On the **server**:

```bash
cd /root/beloved-nextjs/
docker compose up -d --build
```

---
> [!IMPORTANT]
> Make sure your `.env` file on the server has the correct production values.
