# Lost & Found Website
## Live Link: https://assignment-lac-seven.vercel.app
## Overview

The Lost & Found Website is a platform where users can report and claim lost items. The website features a comprehensive backend system that handles item claims, user management, and administrative tasks. This README provides details about the backend functionalities, setup instructions, and API usage.

## Features

- **User Management**: Users can register, log in, and manage their profiles.
- User Endpoints
Register User

POST /api/users/register
Request body: { username, password, email }
Response: User object
Login User

POST /api/users/login
Request body: { username, password }
Response: JWT token
- **Item Reporting**: Users can report lost items with details.
- Item Endpoints
Report Lost Item

POST /api/items/report
Request body: { name, description, foundDate, contactInformation }
Response: Item object
Get Found Items

GET /api/items/found
Response: List of found items
Claim Item

POST /api/items/claim
Request body: { itemId }
Response: Claim status
- **Item Claiming**: Users can browse found items and claim them.
- **Admin Management**: Admins can manage claims and oversee reported items.
- Admin Endpoints
Manage Claims

GET /api/admin/claims
Response: List of all claims
Update Claim Status

PATCH /api/admin/claims/:id
Request body: { status }
Response: Updated claim object

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for Node.js.
- **Prisma**: ORM for database interactions.
- **MongoDB/PostgreSQL**: Database for storing user data and item information.
- **Ant Design**: Frontend component library for styling (if applicable).

## Installation

1. **Clone the Repository**

   ```bash
   git clone (https://github.com/zibranhasan/lost-and-found-item-backend)

