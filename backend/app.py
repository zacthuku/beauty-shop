from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, TokenBlocklist
from views import auth_bp, user_bp, product_bp, order_bp, category_bp
import os
from flask_cors import CORS
from datetime import timedelta
from views.mailserver import email

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://127.0.0.1:5173", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})




app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///beauty.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '467755778'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)


db.init_app(app)
migrate = Migrate(app, db)
 

jwt = JWTManager(app)

email(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None

@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has been revoked, please login again."}), 401

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(category_bp)


@app.route('/')
def index():
    return {'message': 'Welcome to The Beauty Shop API'}, 200

if __name__ == '__main__':
    app.run(debug=True)
