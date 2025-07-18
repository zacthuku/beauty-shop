from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    JWTManager
)
from models import db, User, TokenBlocklist
from datetime import datetime, timezone
from views.mailserver import send_email

auth_bp = Blueprint('auth', __name__)
jwt = JWTManager()


def init_jwt(app):
    jwt.init_app(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has been revoked, please login again."}), 401



@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    username = data.get('username') or data.get('name')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(
        username=username,
        email=data['email'],
        role=data.get('role', 'customer'),
        password_hash=generate_password_hash(data['password'])
    )

    db.session.add(user)
    db.session.commit()
    send_email(user.username, user.email)

    access_token = create_access_token(identity=user.id)
    user_info = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at
    }

    return jsonify({
        "user": user_info,
        "access_token": access_token
    }), 201



@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email or password is missing"}), 400

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            user_info = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "created_at":user.created_at
            }

            return jsonify({
                "access_token": access_token,
                "user": user_info
            }), 200

        return jsonify({"error": "Email or password is incorrect"}), 400

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500



@auth_bp.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    try:
        jti = get_jwt()['jti']
        now = datetime.now(timezone.utc)
        token = TokenBlocklist(jti=jti, created_at=now)
        db.session.add(token)
        db.session.commit()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        print(f"Logout error: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
