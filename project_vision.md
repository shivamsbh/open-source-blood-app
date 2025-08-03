# Blood Bank Management System

## Project Overview

This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to streamline blood bank operations. It connects donors, hospitals, and organizations in a centralized platform to manage blood inventory, donations, and requests efficiently.

## Core Functionalities

The system is built around four main user roles, each with specific permissions and functionalities:

### 1. Admin

Admins have the highest level of authority and are responsible for overseeing the entire system. Their key functions include:

-   **User Management:**
    -   View comprehensive lists of all registered donors, hospitals, and organizations.
    -   Delete any user account from the system (donors, hospitals, or organizations).
    -   Create new admin accounts to delegate administrative tasks.
    -   View a list of all current administrators.
-   **System Monitoring:**
    -   Access analytics and reports to monitor the overall health of the blood bank ecosystem.

### 2. Donor

Donors are individuals who donate blood. Their functionalities are focused on the donation process and their personal donation history:

-   **Blood Donation:**
    -   Register an account and provide necessary personal and medical information.
    -   Log a blood donation at a specific organization, creating an "in" inventory record. This includes details such as blood type and quantity.
-   **Donation History:**
    -   View a complete history of their past donations, including the dates and the organizations they have donated to.

### 3. Hospital

Hospitals are the consumers of blood from the blood bank. Their functionalities revolve around requesting and receiving blood:

-   **Blood Consumption:**
    -   Register an account and provide hospital details.
    -   Request blood from a specific organization, creating an "out" inventory record. This includes the required blood type and quantity.
-   **Inventory & Analytics:**
    -   View the availability of different blood groups from various organizations.
    -   Access analytics to understand blood consumption patterns.
-   **History:**
    -   View a history of all blood requests and the organizations that fulfilled them.

### 4. Organisation

Organizations are the central hubs of the blood bank system. They manage the blood inventory, connecting donors and hospitals:

-   **Inventory Management:**
    -   Maintain a real-time inventory of all blood donations and distributions.
    -   View detailed records of all blood transactions, including donor information, hospital requests, blood type, and quantity.
    -   Track recent inventory changes to monitor the flow of blood.
-   **User Management:**
    -   View a list of all donors who have registered with their organization.
    -   View a list of all hospitals that have requested blood from them.
-   **Analytics:**
    -   Monitor the availability of different blood groups within their inventory.
    -   Analyze donation and consumption trends to optimize their operations.

## Technology Stack

-   **Frontend:** React.js, Redux, React Router, Axios, Bootstrap
-   **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
-   **Database:** MongoDB

## How It Works

1.  **Registration:** Users register on the platform by selecting their role (Donor, Hospital, or Organisation). Admins are created by other admins.
2.  **Donation:** Donors log their donations at a specific organization. The organization's inventory is updated with an "in" record.
3.  **Request:** Hospitals request blood from an organization. If the requested blood is available, the organization's inventory is updated with an "out" record.
4.  **Management:** Organizations manage their inventory, and Admins oversee the entire system, ensuring smooth operation.

This `README.md` provides a clear and detailed explanation of the intended functionality for each role in the Blood Bank Management System.