from flask import Flask, jsonify, request
from flask_migrate import Migrate
from models import db, User, Category, Product, CartItem, Order, OrderItem, Invoice
from datetime import timedelta
from flask_jwt_extended import JWTManager
import os
from flask_mail import Mail
from mail_config import mail

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///beauty.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_app_password'
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@gmail.com'


migrate = Migrate(app, db)
db.init_app(app)

jwt = JWTManager(app)
jwt.init_app(app)
mail.init_app(app) 


from views import *
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(category_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(invoice_bp)

@app.route('/')
def index():
    return {'message': 'Welcome to Beauty Shop API'}, 200

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

if __name__ == '__main__':
    app.run(debug=True)
