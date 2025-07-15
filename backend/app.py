from flask import Flask, jsonify, request
from flask_migrate import Migrate
from models import db, User, Category, Product, CartItem, Order, OrderItem, Invoice
from datetime import timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///beauty.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)


if __name__ == '__main__':
    app.run(debug=True)