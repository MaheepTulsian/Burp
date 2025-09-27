# Fluence VM Deployment Notes

This document records what we deployed to the Fluence VM and how it is configured for production.

- VM
  - Ubuntu 22.04 LTS, 4 vCPUs, 8GB RAM, 50GB SSD (Fluence VM instance)
  - Deployed via Terraform or Fluence Console; VM IP and ID assigned by Fluence

- Nginx
  - Nginx acts as a reverse proxy for the frontend and backend.
  - Frontend served from the VM at the site root; API requests are proxied to the backend under `/api`.
  - Configured proxy_pass for the frontend and backend upstreams.

- SSL
  - TLS handled with certbot / Let's Encrypt on the VM.
  - Nginx configuration includes automatic certificate renewal hooks and redirects HTTP → HTTPS.

- Ports / Firewall
  - Opened and configured ports: 80 (HTTP) and 443 (HTTPS) for public traffic.
  - Backend listens on its internal port (default 5001). Only the proxy (nginx) exposes the service publicly.
  - Additional service ports opened as required for monitoring or other services; all production-facing ports are behind nginx.

- Backend and Process Management
  - Node/Express backend runs under a process manager (pm2 recommended) and binds to the internal port.
  - Environment variables (DB URI, JWT secret, API keys) are kept in the VM's `.env` or a secure secret store.

- Deployment summary
  - Frontend built and served through nginx; backend proxied via `/api` to Node process on the VM.
  - SSL certificates installed and auto-renew configured.
  - Firewall and nginx rules configured to expose only HTTP/HTTPS to the internet.
  - Optionally deployed using Docker / docker-compose for containerized services.

If you want, I can also add the exact `nginx` site config and the `systemd` / `pm2` commands used on the VM.
