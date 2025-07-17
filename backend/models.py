from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

ROLE_CHOICES = ("admin", "order_manager", "customer")
ORDER_STATUS_CHOICES = ("Pending", "Processing", "Shipped", "Delivered")

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(10), nullable=False)
    blocked= db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    cart_items    = db.relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders        = db.relationship("Order",     back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "blocked": self.blocked,
            "created_at": self.created_at.isoformat()
        }

class Category(db.Model):
    __tablename__ = "categories"

    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(50), unique=True, nullable=False)

    products = db.relationship("Product", back_populates="category", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "products": [product.to_dict() for product in self.products]
        }

class Product(db.Model):
    __tablename__ = "products"

    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(100), nullable=False)
    description    = db.Column(db.Text)
    price          = db.Column(db.Float, nullable=False)
    image_url      = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer, default=0)
    category_id    = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    # Relationships
    category       = db.relationship("Category", back_populates="products")
    cart_items     = db.relationship("CartItem",  back_populates="product", cascade="all, delete-orphan")
    order_items    = db.relationship("OrderItem", back_populates="product")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "stock_quantity": self.stock_quantity,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None
        }


class CartItem(db.Model):
    __tablename__ = "cart_items"

    id          = db.Column(db.Integer, primary_key=True)
    quantity    = db.Column(db.Integer, nullable=False)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"))
    product_id  = db.Column(db.Integer, db.ForeignKey("products.id"))

    # Relationships
    user        = db.relationship("User", back_populates="cart_items")
    product     = db.relationship("Product", back_populates="cart_items")

    def to_dict(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "product": self.product.to_dict() if self.product else None
        }

class Order(db.Model):
    __tablename__ = "orders"

    id              = db.Column(db.Integer, primary_key=True)
    status          = db.Column(db.String(50), default="Pending", nullable=False)
    total_price     = db.Column(db.Float, nullable=False)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)
    delivery_address= db.Column(db.String(255))
    billing_info    = db.Column(db.String(255))
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Relationships
    user            = db.relationship("User", back_populates="orders")
    order_items     = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    invoice         = db.relationship("Invoice", back_populates="order", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "total_price": self.total_price,
            "created_at": self.created_at.isoformat(),
            "delivery_address": self.delivery_address,
            "billing_info": self.billing_info,
            "user_id": self.user_id,
            "order_items": [item.to_dict() for item in self.order_items],
            "invoice": self.invoice.to_dict() if self.invoice else None
        }

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id             = db.Column(db.Integer, primary_key=True)
    quantity       = db.Column(db.Integer, nullable=False)
    price_at_order = db.Column(db.Float,   nullable=False)
    order_id       = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id     = db.Column(db.Integer, db.ForeignKey("products.id"))

    # Relationships
    order          = db.relationship("Order", back_populates="order_items")
    product        = db.relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "price_at_order": self.price_at_order,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product": self.product.to_dict() if self.product else None
        }

class Invoice(db.Model):
    __tablename__ = "invoices"

    id             = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(100), unique=True, nullable=False)
    issued_at      = db.Column(db.DateTime, default=datetime.utcnow)
    pdf_url        = db.Column(db.String(255))
    order_id       = db.Column(db.Integer, db.ForeignKey("orders.id"), unique=True)

    # Relationships
    order          = db.relationship("Order", back_populates="invoice", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_number": self.invoice_number,
            "issued_at": self.issued_at.isoformat(),
            "pdf_url": self.pdf_url,
            "order_id": self.order_id,
            
        }


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
