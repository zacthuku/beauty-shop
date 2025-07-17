from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from models import db, User, TokenBlocklist
from datetime import timedelta, datetime
import uuid

auth_bp = Blueprint('auth', __name__,url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'customer'),
        password_hash=generate_password_hash(data['password_hash'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password_hash']):
        return jsonify({"error": "Invalid credentials"}), 401
    if user.blocked is True:
        return jsonify({"error": "User is blocked. contact help desk."}), 403

    access_token = create_access_token(identity={"id": user.id, "role": user.role}, expires_delta=timedelta(days=1))
    return jsonify(access_token=access_token, user=user.to_dict())

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200
