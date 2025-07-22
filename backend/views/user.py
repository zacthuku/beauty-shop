from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from werkzeug.security import generate_password_hash
from models import db, User
import random
import string

user_bp = Blueprint('user', __name__, url_prefix='/users')


@user_bp.route('', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_all_users():
    
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403
    users = User.query.all()
    return jsonify({"users": [u.to_dict() for u in users]})


@user_bp.route('/<int:id>/block', methods=['PATCH','OPTIONS'])
@jwt_required()
def toggle_block_user(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    user = User.query.get_or_404(id)
    user.blocked = not user.blocked
    db.session.commit()

    status = "blocked" if user.blocked else "unblocked"
    return jsonify({
        "message": f"User {status} successfully",
        "user": user.to_dict()
    }), 200


@user_bp.route('/<int:id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_user(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User with ID {id} deleted successfully."}), 200


@user_bp.route('/register/order_manager', methods=['POST', 'OPTIONS'])
@jwt_required()
def create_manager():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "User with this email already exists"}), 409

    otp = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    hashed_password = generate_password_hash(otp)

    new_user = User(
        username=email.split('@')[0],
        email=email,
        password_hash=hashed_password,
        role='manager'
    )
    db.session.add(new_user)
    db.session.commit()

    try:
        msg = Message(
            subject="Welcome to Beauty Shop - Manager Access",
            recipients=[email],
            body=f"Hello,\n\nYou have been registered as a Manager.\nYour temporary password is: {otp}\n\nPlease log in and change your password immediately."
        )
        mail.send(msg)
        return jsonify({
            "message": f"Manager registered and email sent to {email}",
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"error": f"User created but failed to send email: {str(e)}"}), 500
