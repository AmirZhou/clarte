# Clarte App Deployment Guide ✨

## What is Clarte?

Clarte is your friendly neighbourhood French learning app, designed to _not_ suck. It aims to make learning French clear, engaging, and maybe even a little bit fun. This setup includes a web frontend (built with Next.js), a backend API (built with NestJS), and a Postgres database to store all the good stuff.

This guide explains how to deploy the full Clarte stack using Kubernetes (k3s/k3d).

## Prerequisites

Make sure you have the following tools installed on your **local machine**:

- **Git:** To clone the repository.
- **Docker Desktop:** Required for running k3d and the containers locally. (Or Docker Engine on Linux).
- **kubectl:** The Kubernetes command-line tool. ([Install Guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/))
- **k3d:** The tool for running lightweight k3s clusters in Docker locally. ([Install Guide](https://k3d.io/#installation))

For **remote server deployment**:

- A **Linux server** accessible via SSH.
- **k3s** installed and running on the server. ([Install Guide](https://docs.k3s.io/installation))
- Ability to securely copy the `k3s.yaml` kubeconfig file from the server to your local machine.
- (Optional but Recommended) A domain name and DNS configured to point to your server's IP address for proper Ingress setup.

## CI/CD Image Builds

Docker images for the `clarte-web` frontend and `clarte-api` backend are automatically built and pushed to GitHub Container Registry (GHCR) by GitHub Actions workflows located in `.github/workflows/`. These workflows trigger on pushes to the `main` branch. The Kubernetes manifests reference these images (e.g., `ghcr.io/amirzhou/clarte-api:latest`).

## Deployment Steps

Follow the steps for either local deployment (k3d) or remote server deployment (k3s).

---

### Scenario 1: Local Deployment using k3d (Windows/macOS/Linux)

This is great for testing and development.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/AmirZhou/clarte.git
    cd clarte
    ```

2.  **Create k3d Cluster:**

    - We need to map port 80 on your host to the cluster's load balancer for Ingress. Choose a host port (e.g., `80` if free, or `8080`).
    - _(Optional: If port 80 is busy, use the second command)_

    ```bash
    # Option A: Use host port 80 (if free)
    k3d cluster create clarte-local -p "80:80@loadbalancer"

    # Option B: Use host port 8080 (if 80 is busy)
    # k3d cluster create clarte-local -p "8080:80@loadbalancer"
    ```

    - This command creates the cluster and automatically configures `kubectl` to use it. Verify with `kubectl get nodes`.

3.  **Modify Hosts File:**

    - To access the app via `http://clarte.local`, edit your computer's hosts file:
      - Windows: `C:\Windows\System32\drivers\etc\hosts` (Edit as Admin)
      - macOS/Linux: `/etc/hosts` (Use `sudo`)
    - Add this line:
      ```
      127.0.0.1  clarte.local
      ```
    - Save the file.

4.  **Create Kubernetes Secret:**

    - Create the secret for Postgres using **test/local credentials**.

    ```bash
    kubectl create secret generic postgres-secret \
      --from-literal=POSTGRES_USER='your-user' \
      --from-literal=POSTGRES_PASSWORD='your-password'
    # (Or use --from-file=... pointing to local .txt files if you prefer)
    ```

5.  **Apply Kubernetes Manifests:**

    - Apply all the configuration files from the `k8s` directory. The order generally doesn't strictly matter with `apply -f`, but applying dependencies first is good practice.

    ```bash
    # Apply Postgres components
    kubectl apply -f k8s/postgres-service.yaml
    kubectl apply -f k8s/postgres-statefulset.yaml

    # Wait for Postgres pod to be Running and Ready (1/1)
    echo "Waiting for Postgres pod to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres --timeout=300s

    # Apply the Migration Job
    kubectl apply -f k8s/migration-job.yaml

    # Apply API components
    kubectl apply -f k8s/api-service.yaml
    kubectl apply -f k8s/api-deployment.yaml

    # Wait for API and Web pods to attempt starting
    echo "Waiting for API and Web deployments..."
    sleep 900 # It may take around 10 minuts to populate the database.

    # Apply Web components
    kubectl apply -f k8s/web-service.yaml
    kubectl apply -f k8s/web-deployment.yaml

    # Wait for API and Web pods to attempt starting
    echo "Waiting for API and Web deployments..."
    sleep 15 # Give them a moment to start

    # Apply the Ingress rules
    kubectl apply -f k8s/ingress.yaml
    ```

6.  **Monitor Deployment:**

    - Check the migration job status:
      ```bash
      kubectl get jobs -w
      # Once created, check logs: kubectl logs job/<job-name>
      ```
    - Check the status of all pods:
      ```bash
      kubectl get pods -w
      ```
      _(Wait until `postgres-0`, `clarte-api-...`, and `clarte-web-...` pods are `Running` and `READY 1/1`)_

7.  **Access the App:**
    - Open your browser.
    - Navigate to:
      - `http://clarte.local` (if you mapped host port 80)
      - `http://clarte.local:8080` (if you mapped host port 8080)

---

### Scenario 2: Remote Server Deployment using k3s (Linux - e.g., Ubuntu 22.04)

This deploys to your dedicated Linux server running k3s by running commands directly on the server.

1.  **SSH into your Server:**

    ```bash
    ssh your_user@your_server_ip
    ```

2.  **Install Prerequisites (if needed):**

    - Ensure k3s is installed and running.
    - Install Git: `sudo apt update && sudo apt install git -y`
    - Install kubectl (if not bundled with your k3s or you need a specific version): Follow official Kubernetes instructions. Often, k3s makes `kubectl` available automatically. Verify with `kubectl version`.

3.  **Clone the Repository (On the Server):**

    ```bash
    git clone https://github.com/AmirZhou/clarte.git
    cd clarte
    ```

4.  **Verify `kubectl` Configuration:**

    - When running `kubectl` directly on the k3s server node, it should automatically use the correct configuration (typically found at `/etc/rancher/k3s/k3s.yaml`).
    - Verify connection: `kubectl get nodes` (should show your server node, likely with the 'control-plane,master' role).

5.  **Create Kubernetes Secret (Using Production Credentials):**

    - Run this command directly on the server using **strong, unique production credentials**.

    ```bash
    kubectl create secret generic postgres-secret \
      --from-literal=POSTGRES_USER='YOUR_PROD_DB_USER' \
      --from-literal=POSTGRES_PASSWORD='YOUR_STRONG_PROD_PASSWORD'
    # (Or use --from-file=... pointing to files you create securely on the server)
    ```

6.  **Apply Kubernetes Manifests:**

    - Apply all configurations from the `k8s` directory (which you cloned onto the server).

    ```bash
    # Apply Postgres components
    kubectl apply -f k8s/postgres-service.yaml
    kubectl apply -f k8s/postgres-statefulset.yaml

    # Wait for Postgres pod to be Running and Ready (1/1)
    echo "Waiting for Postgres pod to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres --timeout=300s

    # Apply the Migration Job
    kubectl apply -f k8s/migration-job.yaml

    # Apply API components
    kubectl apply -f k8s/api-service.yaml
    kubectl apply -f k8s/api-deployment.yaml

    # Wait for API and Web pods to attempt starting
    echo "Waiting for API and Web deployments..."
    sleep 900 # It may take around 10 minuts to populate the database.

    # Apply Web components
    kubectl apply -f k8s/web-service.yaml
    kubectl apply -f k8s/web-deployment.yaml

    # Wait for API and Web pods to attempt starting
    echo "Waiting for API and Web deployments..."
    sleep 15 # Give them a moment to start

    # Apply the Ingress rules
    kubectl apply -f k8s/ingress.yaml
    ```

7.  **Monitor Deployment:**

    - Check the migration job: `kubectl get jobs -w`, `kubectl logs job/<job-name>`
    - Check all pods: `kubectl get pods -w`

8.  **Configure DNS & Access the App:**
    - **(External Step)** Ensure you have a DNS A record pointing your desired domain name (e.g., `clarte.yourdomain.com`) to your server's public IP address.
    - **(On Server)** Update the `host:` field in `k8s/ingress.yaml` from `clarte.local` to `clarte.yourdomain.com` (e.g., using `nano` or `vim`).
    - **(On Server)** Re-apply the ingress: `kubectl apply -f k8s/ingress.yaml`.
    - **(Optional but Recommended)** Set up TLS/HTTPS using Let's Encrypt, typically via annotations on the Ingress resource and configuring Traefik or cert-manager.
    - **(From Any Machine)** Access your app via `http://clarte.yourdomain.com` (or `https://` if you set up TLS).

---

Enjoy your clearly deployed Clarte app! ✨
