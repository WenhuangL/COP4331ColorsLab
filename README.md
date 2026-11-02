# COLORS Lab

## Description
The COLORS Lab will showcase log in, add new colors, and search features for an existing color database. 

## Technologies Used
* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP
* **Database:** MySQL
* **Hosting:** DigitalOcean (LAMP Stack on Ubuntu 24.04)

## Setup Instructions
1. **Server Provisioning:** Deploy a LAMP stack droplet on DigitalOcean and point your purchased domain to the server's IP address via an A record.
2. **Database Configuration:** Access MySQL via the command line, create the `COP4331` database, and execute the provided SQL scripts to build the required `Users`, `Colors`, and `Contacts` tables. 
3. **Database User:** Create a dedicated MySQL user and grant it full privileges to the database so the PHP API can execute queries.
4. **Configuration:** Update the database connection string within the PHP files located in the `api/` directory to match your dedicated MySQL credentials.
5. **Deployment:** Transfer the frontend assets (from the `public/` directory) directly to the web root (`/var/www/html`) and the backend files (from the `api/` directory) into `/var/www/html/LAMPAPI`.

## How to Run and Access
Navigate to `http://goodcompanygames.co` in any modern web browser. From the interface, you can log in and manage your colors. 

To test the backend independently, send POST requests with standard JSON payloads to the API endpoints (e.g., `http://yourdomain.com/LAMPAPI/Login.php`) using a tool like Postman.

## Assumptions, Limitations, and AI Usage
* **Assumptions:** The host server has Apache, MySQL, and PHP pre-installed and running. 
* **Limitations:** The application currently relies on standard HTTP. Passwords are hashed using MD5.
* **AI Usage:** AI was used for documentation formatting and help with tool navigation. AI assistance was also used to generate the UML diagrams in `docs/uml`; the diagrams were then checked against the source code and corrected.