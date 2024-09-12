# 🛠️ Lost & Found Website

This repository contains the codebase for a **Lost & Found** web application that helps users report and claim lost items. It features user and admin management, an item claim process, and a comprehensive list of found items.

## 🚀 Features

- **User Authentication**
  - Users can sign up and log in to report or claim lost items.
  - Admins have enhanced permissions to manage items and claims.
  
- **Found Items Management**
  - Users can browse through all found items, with the ability to filter by category and other criteria.
  - Each item is displayed in a consistent card format with fixed image size and a "Claim" button.

- **Claim Process**
  - Users can claim an item by providing verification details.
  - Claim requests include fields such as distinguishing features, date lost, verification method, and contact information.

- **Admin Panel**
  - Admins can manage user claims and update the status of items.
  - The system supports viewing, approving, or rejecting claims based on verification.

## 🧩 Components

### `FoundItemsPage`
- Displays a grid of all found items with consistent styling for images and card heights.
- Users can click on an item to view details or initiate a claim.

### `Claims Modal`
- A modal window that provides details about the claim process, including distinguishing features, date lost, verification methods, and contact details.
- Styled for a rich user experience.

### `DashboardLayout`
- A clean and classic admin layout without footer buttons.
- Attractive navigation links for ease of use.

## ⚙️ Technologies Used

- **Frontend**: React, Ant Design
- **Backend**: Node.js, Express.js, Prisma
- **Database**: PostgreSQL

## 🛠️ Installation

To get started with the project, follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/lost-and-found.git
