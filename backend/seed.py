from app import app
from models import db, Product, Category, User, Order, OrderItem, Invoice
import random               
from datetime import datetime
from werkzeug.security import generate_password_hash


categories_data = [
    {"name": "skincare", "label": "Skincare", "icon": "✨"},
    {"name": "makeup", "label": "Makeup", "icon": "💄"},
    {"name": "haircare", "label": "Haircare", "icon": "💇‍♀"},
]


products_data = [
    {"name": "Hydrating Vitamin C Serum", "category": "skincare", "price": 600, "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop", "description": "A powerful vitamin C serum that brightens and hydrates your skin for a radiant glow.", "in_stock": True, "rating": 4.8, "reviews": 324},
    {"name": "Gentle Cleansing Foam", "category": "skincare", "price": 499, "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop", "description": "A gentle, sulfate-free cleanser that removes makeup and impurities without stripping your skin.", "in_stock": True, "rating": 4.6, "reviews": 189},
    {"name": "Retinol Night Cream", "category": "skincare", "price": 1280, "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop", "description": "Anti-aging night cream with retinol to reduce fine lines and improve skin texture.", "in_stock": True, "rating": 4.9, "reviews": 456},
    {"name": "Hydrating Face Mask", "category": "skincare", "price": 455, "image": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop", "description": "Intensive hydrating mask with hyaluronic acid for plump, moisturized skin.", "in_stock": True, "rating": 4.7, "reviews": 267},
    {"name": "Full Coverage Foundation", "category": "makeup", "price": 1520, "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop", "description": "Long-lasting, full coverage foundation available in 40 shades.", "in_stock": True, "rating": 4.5, "reviews": 892},
    {"name": "Matte Liquid Lipstick", "category": "makeup", "price": 289, "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop", "description": "Long-wearing matte liquid lipstick that doesn't dry out your lips.", "in_stock": True, "rating": 4.4, "reviews": 634},
    {"name": "Eyeshadow Palette", "category": "makeup", "price": 650, "image": "https://images.unsplash.com/photo-1650664370914-f026578ec2a4?q=80&w=769&auto=format&fit=crop", "description": "18-shade eyeshadow palette with matte and shimmer finishes.", "in_stock": True, "rating": 4.8, "reviews": 445},
    {"name": "Volumizing Mascara", "category": "makeup", "price": 350, "image": "https://images.unsplash.com/photo-1619168213439-8af6b0fd5956?q=80&w=707&auto=format&fit=crop", "description": "Waterproof volumizing mascara for dramatic, long-lasting lashes.", "in_stock": False, "rating": 4.6, "reviews": 523},
    {"name": "Nourishing Hair Oil", "category": "haircare", "price": 1750, "image": "https://images.unsplash.com/photo-1669281393011-c335050cf0e9?q=80&w=1025&auto=format&fit=crop", "description": "Lightweight hair oil that nourishes and adds shine without weighing hair down.", "in_stock": True, "rating": 4.7, "reviews": 298},
    {"name": "Repair Shampoo", "category": "haircare", "price": 2085, "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", "description": "Sulfate-free shampoo that repairs and strengthens damaged hair.", "in_stock": True, "rating": 4.5, "reviews": 412},
    {"name": "Deep Conditioning Mask", "category": "haircare", "price": 550, "image": "https://images.unsplash.com/photo-1526045478516-99145907023c?w=400&h=400&fit=crop", "description": "Weekly deep conditioning treatment for dry and damaged hair.", "in_stock": True, "rating": 4.9, "reviews": 356},
    {"name": "Heat Protection Spray", "category": "haircare", "price": 2999, "image": "https://images.unsplash.com/photo-1651763473748-f3674427ade3?q=80&w=1170&auto=format&fit=crop", "description": "Protects hair from heat damage up to 450°F while adding shine.", "in_stock": True, "rating": 4.4, "reviews": 278},
    {"name": "Brightening Eye Cream", "category": "skincare", "price": 999, "image": "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop", "description": "Reduces dark circles and puffiness while firming the delicate eye area.", "in_stock": True, "rating": 4.6, "reviews": 203},
    {"name": "Contouring Kit", "category": "makeup", "price": 580, "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", "description": "Professional contouring kit with 6 shades for sculpting and highlighting.", "in_stock": True, "rating": 4.3, "reviews": 167},
    {"name": "Dry Shampoo", "category": "haircare", "price": 1490, "image": "https://images.unsplash.com/photo-1630398917451-1a409990fbc5?q=80&w=735&auto=format&fit=crop", "description": "Refreshes hair between washes and adds volume at the roots.", "in_stock": True, "rating": 4.2, "reviews": 389},
    {"name": "Exfoliating Scrub", "category": "skincare", "price": 1200, "image": "https://images.unsplash.com/photo-1589504695518-a9a9ac06c2e9?q=80&w=687&auto=format&fit=crop", "description": "Gentle exfoliating scrub that removes dead skin cells for smoother skin.", "in_stock": True, "rating": 4.5, "reviews": 445},
]

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        categories = {}
        for cat in categories_data:
            category = Category(name=cat["name"], label=cat["label"], icon=cat["icon"])
            db.session.add(category)
            categories[cat["name"]] = category

        db.session.commit()

        products = []
        for prod in products_data:
            product = Product(
                name=prod["name"],
                description=prod["description"],
                price=prod["price"],
                image_url=prod["image"],
                stock_quantity=100 if prod["in_stock"] else 0,
                in_stock=prod["in_stock"],
                rating=prod["rating"],
                reviews=prod["reviews"],
                category=categories[prod["category"]]
            )
            db.session.add(product)
            products.append(product)

        db.session.commit()

        existing_admin = User.query.filter_by(email="admin@gmail.com").first()
        if not existing_admin:
            admin_user = User(
                username="admin",
                email="admin@gmail.com",
                password=generate_password_hash("admin123"),
                role="admin",
                created_at=datetime.utcnow()
            )
            db.session.add(admin_user)
            print("Admin user created.")
        else:
            print("Admin user already exists. Skipping...")

        db.session.commit()

        customer = User(
            username="jane_doe",
            email="jane@example.com",
            password=generate_password_hash("securepass"),
            role="customer",
            created_at=datetime.utcnow()
        )
        db.session.add(customer)
        db.session.commit()

        order1 = Order(user_id=customer.id, status="pending", total_price=0.0)
        order2 = Order(user_id=customer.id, status="completed", total_price=0.0)
        order3 = Order(user_id=customer.id, status="shipped", total_price=0.0)
        db.session.add_all([order1, order2, order3])
        db.session.commit()

        items = [
            OrderItem(order_id=order1.id, product_id=products[0].id, quantity=2, price_at_order=products[0].price),
            OrderItem(order_id=order1.id, product_id=products[1].id, quantity=1, price_at_order=products[1].price),
            OrderItem(order_id=order2.id, product_id=products[2].id, quantity=3, price_at_order=products[2].price),
            OrderItem(order_id=order2.id, product_id=products[0].id, quantity=1, price_at_order=products[0].price),
            OrderItem(order_id=order3.id, product_id=products[1].id, quantity=2, price_at_order=products[1].price),
            ]


        db.session.add_all(items)
        db.session.commit()

        # Update total prices
        order1.total_price = sum(item.quantity * next((p.price for p in products if p.id == item.product_id), 0) for item in items if item.order_id == order1.id)
        order2.total_price = sum(item.quantity * next((p.price for p in products if p.id == item.product_id), 0) for item in items if item.order_id == order2.id)
        order3.total_price = sum(item.quantity * next((p.price for p in products if p.id == item.product_id), 0) for item in items if item.order_id == order3.id)

        db.session.commit()

        db.session.add_all([
            Invoice(invoice_number="INV1001", order_id=order1.id, pdf_url="/invoices/inv1001.pdf"),
            Invoice(invoice_number="INV1002", order_id=order2.id, pdf_url="/invoices/inv1002.pdf"),
            Invoice(invoice_number="INV1003", order_id=order3.id, pdf_url="/invoices/inv1003.pdf"),
        ])
        db.session.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    seed_data()
