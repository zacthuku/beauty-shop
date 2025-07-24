# The Beauty

This is a multiuser e-commerce web application for a beauty products shop, featuring a modern intuative frontend built with React and a Python Flask backend. The platform allows users to browse, search, and purchase beauty products, manage their cart, and view order history.

## Features

- User authentication (register, login, profile)
- Product catalog with categories and product details
- Shopping cart and checkout flow
- Order history and order confirmation
- Product reviews and ratings
- Responsive, modern UI

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Python, Flask
- **Database:** PostgreSQL

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies (using pipenv):
   ```sh
   pipenv install
   ```
3. Run database migrations:
   ```sh
   pipenv run flask db upgrade
   ```
4. Seed the database
   ```sh
   pipenv run python seed.py
   ```
5. Start the backend server:
   ```sh
   pipenv run flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. It will run on the locahost

## Usage

- Browse products, view details, and add items to your cart.
- Register or log in to place orders and view your order history.

### Admin Access

Admin Login

1. Login with admin credentials

```
- Email: admin@admin
- Password: admin@thebeauty
```

2. Admins will automatically be redirected to admin page
3. Access the admin dashboard to view registered users

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## Live Demo

-Vercel frontend [The Beauty](https://beauty-shop-opal.vercel.app/)

-Render [Backend](https://beauty-shop-xoxn.onrender.com/)

## Support

For support, questions, or feedback, open an issue or contact the developers:

📧 dmnbilly@gmail.com

📧 marycharity5@gmail.com

📧 zacthuku@gmail.com

---

**Made with love**

_Happy Shopping!_
