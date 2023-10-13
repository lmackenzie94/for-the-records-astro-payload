### Payload SCSS Variables

https://github.com/payloadcms/payload/blob/master/src/admin/scss/app.scss
https://github.com/payloadcms/payload/blob/master/src/admin/scss/colors.scss

### Auth

Logging in to the CMS at /login creates a cookie called "payload-token"

- this cookie determines what you can read,update,etc on both the front- and back-end
- if you log out of the CMS, any collections that don't allow public "read" access will not be displayed on the front-end.

### DigitalOcean Setup

#### [Initial Server Setup with Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

**1. Create Ubuntu 20.04 droplet (Regular > $6/mo)**

- `Droplets`: are Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use, either standalone or as part of a larger, cloud-based infrastructure.
  - `Virtual Machine (VM)`: is a compute resource that uses software instead of a physical computer to run programs and deploy apps.
- `Ubuntu`: is a popular open-source Linux distribution (OS) that is easy to use and well maintained. It is a good choice for beginners who are new to the Linux ecosystem.

**2. Add SSH key**

**3. Log in to droplet via SSH as root**

- `ssh root@<droplet-ip>` (68.183.200.33)
- **About root:** The root user is the administrative user in a Linux environment that has very broad privileges. Because of the heightened privileges of the root account, y**ou are discouraged from using it on a regular basis**. This is because the root account is able to make very destructive changes, even by accident.

**4. Create new user**

- `adduser <username>` (luke)
  - password saved in 1Password
- `usermod -aG sudo <username>`
  - grant admin privileges to new user by adding to sudo group (this will allow running commands with `sudo`)

**5. Set up basic firewall**

- to make sure only connections to certain services are allowed
- once enabled, the firewall will block all connections except for SSH, so if you install and configure additional services, you will need to adjust the firewall settings to allow traffic in.

**6. Enable external access for regular user**

- need to add a copy of your local public key to the new user’s ~/.ssh/authorized_keys file to log in successfully.
- since your public key is already in the root account’s ~/.ssh/authorized_keys file on the server, we can copy that file and directory structure to our new user account.
- `rsync --archive --chown=luke:luke ~/.ssh /home/luke`

**7. Going forward, SSH using the new user (luke)**

- `ssh luke@68.183.200.33`

#### [Domain & DNS Setup](https://docs.digitalocean.com/products/networking/dns/getting-started/quickstart/)

- registered `for-the-records.com` domain with Namecheap
- adding a domain you own to your DigitalOcean account lets you manage the domain’s DNS records with the control panel and API.
- in DigitalOcean, click 'Create' > 'Domains/DNS' > Add Domain (for-the-records.com)
- add A record for `for-the-records.com` **and** `www.for-the-records.com` (pointing to droplet IP)
- [Point to DigitalOcean Nameservers From Common Domain Registrars](https://docs.digitalocean.com/products/networking/dns/getting-started/dns-registrars/)
  - DNS (Domain Name System) is a naming system that maps a server’s domain name, like example.com, to an IP address, like 203.0.113.1. This is what allows you to direct a domain name to the web server hosting that domain’s content, for example.
  - To lookup your domain's registrar:
    - `whois for-the-records.com`
  - To use DigitalOcean DNS, you’ll need to update the nameservers used by your domain registrar to DigitalOcean’s nameservers instead.
    - In short, **nameservers define your domain’s current DNS provider.** When you update your nameservers, you’re telling your registrar to start using a different DNS provider to resolve your domain’s DNS records.

#### [Install Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

- Nginx is one of the most popular web servers in the world and is responsible for hosting some of the largest and highest-traffic sites on the internet

**1. Install**

- `sudo apt update` (update our local package index so that we have access to the most recent package listings)
- `sudo apt install nginx`

**2. Adjust the Firewall**

- `sudo ufw app list` (list the application profiles)
- `sudo ufw allow 'Nginx HTTP'` (allowing traffic on port 80 - normal, unencrypted web traffic)
- `sudo ufw status` (check the change)

**3. Check your Web Server**

- `systemctl status nginx` (check if Nginx is running) - should see "active (running)"
- best way to test is to visit your server’s public IP address in your web browser
  - `http://<your_server_ip>` (68.183.200.33)
  - should see "Welcome to nginx!" screen

**4. Managing the Nginx Process**

- `sudo systemctl stop nginx` (stop the web server)
- `sudo systemctl start nginx` (start the web server)
- `sudo systemctl restart nginx` (restart the web server)
- `sudo systemctl reload nginx` (reload the web server configuration)
- `sudo systemctl disable nginx` (disable the web server from starting at boot)
- `sudo systemctl enable nginx` (enable the web server to start at boot)

**5. Set up Server Blocks (Recommended)**

- used to encapsulate configuration details and host more than one domain from a single server
- Nginx on Ubuntu 20.04 has one server block enabled by default that is configured to serve documents out of a directory at `/var/www/html`
- Instead of modifying /var/www/html, let’s create a directory structure within /var/www for our [your_domain] site, leaving /var/www/html in place as the default directory to be served if a client request doesn’t match any other sites.

  - Create the root web directory for [your_domain] (for-the-records.com):
    - `sudo mkdir -p /var/www/for-the-records.com/html`
  - Assign ownership of the directory with the $USER environment variable, which will reference your current system user:
    - `sudo chown -R $USER:$USER /var/www/for-the-records.com/html`
  - Next, adjust the permissions of your web roots so that only you can read, write, and execute files:
    - `sudo chmod -R 755 /var/www/for-the-records.com`
  - Create a sample index.html page using nano or your favorite text editor:
    - `sudo nano /var/www/for-the-records.com/html/index.html`
    - add some HTML content:
    - ```html
      <html>
        <head>
          <title>Welcome to For The Records!</title>
        </head>
        <body>
          <h1>Success! The for-the-records.com server block is working!</h1>
        </body>
      </html>
      ```
  - In order for Nginx to serve this content, it’s necessary to create a server block with the correct directives:

    - `sudo nano /etc/nginx/sites-available/for-the-records.com`
    - add the following server block:
    - ```nginx
      server {
          listen 80;
          listen [::]:80;

          root /var/www/for-the-records.com/html;
          index index.html index.htm index.nginx-debian.html;

          server_name for-the-records.com www.for-the-records.com;

          location / {
              try_files $uri $uri/ =404;
          }
      }
      ```

  - To enable the new server block configuration, link the file to the sites-enabled directory:
    - `sudo ln -s /etc/nginx/sites-available/for-the-records.com /etc/nginx/sites-enabled/`

- Two server blocks are now enabled and configured to respond to requests based on their listen and server_name directives:
  - `for-the-records.com`: Will respond to requests for for-the-records.com and www.for-the-records.com.
  - `default`: Will respond to any requests on port 80 that do not match the other two blocks.
- To avoid a possible hash bucket memory problem that can arise from adding additional server names, it is necessary to adjust a single value in the /etc/nginx/nginx.conf file. Open the file:
  - `sudo nano /etc/nginx/nginx.conf`
  - Find the `server_names_hash_bucket_size` directive and remove the # symbol to uncomment the line.
- Make sure there are no syntax errors in any of your Nginx files:
  - `sudo nginx -t`
- Restart Nginx to enable your changes:
  - `sudo systemctl restart nginx`
- Now, when you visit your server’s domain name or IP address, your new content should be served.

#### [Secure Ngix with Let's Encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

- Let’s Encrypt is a Certificate Authority (CA) that provides an easy way to obtain and install free TLS/SSL certificates, thereby enabling encrypted HTTPS on web servers.
- use Certbot to obtain a free SSL certificate for Nginx on Ubuntu 20.04 and set up your certificate to renew automatically.
- Install Certbot and it’s Nginx plugin with apt:
  - `sudo apt install certbot python3-certbot-nginx`
- check that you have a server block for your domain at /etc/nginx/sites-available/for-the-records.com with the server_name directive already set appropriately.
  - `sudo nano /etc/nginx/sites-available/for-the-records.com`
- allow HTTPS through the firewall:
  - `sudo ufw allow 'Nginx Full'`
  - `sudo ufw delete allow 'Nginx HTTP'` (delete the redundant rule)
- use Certbot to obtain an SSL certificate:
  - `sudo certbot --nginx -d for-the-records.com -d www.for-the-records.com`
  - choose whether or not to redirect HTTP traffic to HTTPS
    - I selected "1": "No redirect" - SHOULD I CHANGE THIS..?
    - "_You can undo this change by editing your web server's configuration._"
  - with that, your certificates are downloaded, installed, and loaded!
- Let’s Encrypt’s certificates are only valid for ninety days. This is to encourage users to automate their certificate renewal process. The certbot package we installed takes care of this for us by adding a systemd timer that will run twice a day and automatically renew any certificate that’s within thirty days of expiration.

#### [Install & Secure MongoDB](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04) and [Create new MongoDB and user](https://mhagemann.medium.com/how-to-add-a-new-user-to-a-mongodb-database-d896776b5362)

- skipped for now - using MongoDB Atlas instead

#### [Install Node.js](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)

- set up a production-ready Node.js environment on a single Ubuntu 20.04 server. This server will run a Node.js application managed by PM2, and provide users with secure access to the application through an Nginx reverse proxy. The Nginx server will offer HTTPS using a free certificate provided by Let’s Encrypt.
  - `cd ~` (change to home directory)
  - `curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh`
  - `sudo bash nodesource_setup.sh`
  - `sudo apt install nodejs`
  - `node -v` (check version) - v14.21.3
- **Note**: When installing from the NodeSource PPA, the Node.js executable is called `nodejs`, rather than `node`.
- In order for some npm packages to work (those that require compiling code from source, for example), you will need to install the `build-essential` package:
  - `sudo apt install build-essential`
- See the link for creating/test a simple demo Node.js app.
- **Install PM2:**
  - PM2 is a process manager for Node.js applications. It allows you to keep applications alive forever, to reload them without downtime, and to facilitate common system admin tasks. ("_Makes it possible to daemonize applications_")
    - `sudo npm install pm2@latest -g`
    - `pm2 start hello.js` (start hello.js with PM2)
  - Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but we can take an additional step to get the application to launch on system startup using the startup subcommand.
    - `pm2 startup systemd`
    - see docs for more info
- **Set up Nginx as a Reverse Proxy Server:**
  - `Reverse proxy server`: is a kind of server that listens to client requests and forward or relays the requests to the relevant web application. At the same time, it responds to the client with the web application’s response.
  - just follow the [docs](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04#step-4-setting-up-nginx-as-a-reverse-proxy-server).
  - **NOTE:** you can add multiple `location` blocks to the server block in `/etc/nginx/sites-available/for-the-records.com` to serve multiple Node.js apps on the same server.
  - serve Payload CMS from `/admin` directory:
    - `sudo nano /etc/nginx/sites-available/for-the-records.com`
    - ```nginx
        location /admin {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
      ```
      `mkdir admin`
      `cd admin`
      `nano index.js` -> add server code
      `pm2 start index.js`
      `pm2 save`
      `pm2 list`
      `sudo systemctl start pm2-luke`
      - when in doubt, `sudo reboot` or `pm2 restart all`
    - PM2 Docs (https://pm2.keymetrics.io/docs/usage/process-management/)

#### [Transfer Files to Droplets With FileZilla](https://docs.digitalocean.com/products/droplets/how-to/transfer-files/)

- Open FileZilla on your local machine
- `Edit` > `Settings` > `SFTP` > `Add keyfile` > `Select private key file` (id_rsa)
  - `/Users/lukemackenzie/.ssh/id_rsa`
- `Site Manager` > `New Site` > `Protocol: SFTP`
- `Host:` 68.183.200.33
- `Port:` 22
- `Logon Type:` Interactive
- `User:` luke

**TEMPORARY:**

**1. Astro**

- build Astro site locally
- copy contents of `dist` folder to `/var/www/for-the-records.com/html`

**2. Payload**

- `sudo mkdir -p /var/www/for-the-records.com/html/admin`
- `sudo chown -R $USER:$USER /var/www/for-the-records.com/html/admin`
- build Payload CMS locally (`yarn build`)
  - `dist`: server code
  - `build`: built admin panel
- copy contents of `build` folder to `/var/www/for-the-records.com/html/admin`
- **TODO:** figure out what to do from here ...
- going to /admin loads the simple Node app I created earlier... (line 216 above)
  - which is running via PM2 `index` process

Might be helpful -> https://payloadcms.com/community-help/discord/suggestions-for-syncing-local-prod-databases (see `ecosystem.config.js`)

This tutorial helped get things working: https://www.showwcase.com/show/18570/how-to-deploy-payloadcms-to-digitialocean-and-connect-to-s3-bucket

`cd /var/www/for-the-records.com/html/admin`

#### Figure this out:

`sudo nano /etc/nginx/sites-available/for-the-records.com`
`sudo systemctl restart nginx`

// why does changing /admin to /cms not work?
// also, I don't think I should have to add all these...
location /admin {
proxy_pass http://localhost:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}
location /api {
proxy_pass http://localhost:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}
location /assets {
proxy_pass http://localhost:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}
location /media {
proxy_pass http://localhost:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}

#### Questions:

- why do I need node_modules in production when running `yarn serve` (in home/luke/payload folder)
  - ended up running build directly on the server to generate node_modules folder
  - then in Buddy pipeline, ignore node_modules folder (otherwise the copy would take forever)
