from faker import Faker
from models import User, Category, Product, CartItem, Order, OrderItem, Invoice
import random
from datetime import datetime
from app import app, db
from werkzeug.security import generate_password_hash

fake = Faker()

ROLE_CHOICES = ("admin", "order_manager", "customer")
ORDER_STATUS_CHOICES = ("Pending", "Processing", "Shipped", "Delivered")

def seed_data(num_categories=5, num_products=20):
    db.drop_all()
    db.create_all()


    categories = []
    for _ in range(num_categories):
        category = Category(name=fake.unique.word().capitalize())
        db.session.add(category)
        categories.append(category)

    db.session.commit()

    
    products = []
    for _ in range(num_products):
        product = Product(
            name=fake.unique.word().capitalize(),
            description=fake.text(max_nb_chars=100),
            price=round(random.uniform(100, 1000), 2),
            image_url=fake.image_url(),
            stock_quantity=random.randint(5, 100),
            category=random.choice(categories)
        )
        db.session.add(product)
        products.append(product)

    db.session.commit()

    
    existing_admin = User.query.filter_by(email="admin@gmail.com").first()
    if not existing_admin:
        admin_user = User(
            username="admin",
            email="admin@gmail.com",
            password_hash=generate_password_hash("admin123"),
            role="admin",
            created_at=datetime.utcnow()
        )
        db.session.add(admin_user)
        print("Admin user created.")
    else:
        print("Admin user already exists. Skipping...")

    db.session.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_data()
