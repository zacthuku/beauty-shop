# Beauty Shop

An e-commerce web application for a beauty products shop, featuring a modern frontend built with React (Vite) and a Python Flask backend. The platform allows users to browse, search, and purchase beauty products, manage their cart, and view order history. Admin features can be extended in the `frontend/admin` directory.

## Features

- User authentication (register, login, profile)
- Product catalog with categories and product details
- Shopping cart and checkout flow
- Order history and order confirmation
- Product reviews and ratings
- Responsive, modern UI
- Admin-ready structure for future management features

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, Flask, SQLAlchemy
- **Database:** SQLite (default, can be changed)

## Project Structure

```
beauty-shop/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   ├── migrations/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── ...
│   ├── admin/
│   └── ...
└── README.md
```

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
4. Seed the database (optional):
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
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Browse products, view details, and add items to your cart.
- Register or log in to place orders and view your order history.
- Admin features can be added in the `frontend/admin` directory.

## Folder Overview

- `backend/` - Flask API, models, migrations, and database
- `frontend/` - React app, UI components, pages, and admin folder

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
