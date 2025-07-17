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

# Register Blueprints
from views import *
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(category_bp)
app.register_blueprint(cart_bp)

@app.route('/')
def index():
    return {'message': 'Welcome to Beauty Shop API'}, 200

if __name__ == '__main__':
    app.run(debug=True)
