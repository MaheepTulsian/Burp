# Fluence VM Deployment Notes

This document records our deployment on Fluence VM and the basic configuration setup.

## Deployment Architecture

![Fluence VM Deployment Flow](https://placeholder-image-url.com/deployment-flow.png)

## Infrastructure

### Fluence VM Instance
- **VM Specs**: Ubuntu 22.04 LTS, 4 vCPUs, 8GB RAM, 50GB SSD
- **Deployment**: Via Fluence Console or Terraform
- **Network**: Static IP assigned by Fluence platform

### Service Configuration

**Nginx (Reverse Proxy)**
- Frontend served from root (`/`)
- API requests proxied to backend via `/api`
- SSL with Let's Encrypt certificates
- HTTP to HTTPS redirect

**Backend Service**
- Node.js/Express API running on port 5001 (internal)
- Managed by PM2 process manager
- Environment variables stored securely

**Network & Security**
- **Public Ports**: 80 (HTTP), 443 (HTTPS)
- **Internal Port**: 5001 (backend API, proxied only)
- Firewall configured to expose only HTTP/HTTPS

## Deployment Flow

1. **Provision Fluence VM** via Console/Terraform
2. **Deploy application** code and dependencies
3. **Configure Nginx** for reverse proxy and SSL
4. **Start services** with PM2 process manager
5. **Configure firewall** and security settings

## Key Files

```
/etc/nginx/sites-available/default  # Nginx configuration
/home/user/.env                     # Environment variables
ecosystem.config.js                 # PM2 configuration
```

---

*Deployed on Fluence VM platform for decentralized compute infrastructure*