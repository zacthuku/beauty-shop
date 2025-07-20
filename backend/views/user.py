from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from werkzeug.security import generate_password_hash
from models import db, User
import random
import string

user_bp = Blueprint('user', __name__, url_prefix='/users')


def is_admin():
    identity = get_jwt_identity()
    if isinstance(identity, dict):
        return identity.get("role") == "admin"
    user = User.query.get(identity)
    return user and user.role == "admin"


def get_user_id():
    identity = get_jwt_identity()
    return identity.get("id") if isinstance(identity, dict) else identity


@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_user_id()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_users():
    if not is_admin():
        return jsonify({"error": "Admin only"}), 403

    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@user_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    if not is_admin():
        return jsonify({"error": "Admin only"}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


@user_bp.route('/<int:id>/block', methods=['PATCH'])
@jwt_required()
def toggle_block_user(id):
    if not is_admin():
        return jsonify({"error": "Admin only"}), 403

    data = request.get_json()
    blocked_status = data.get('blocked')

    if blocked_status not in [True, False]:
        return jsonify({"error": "Invalid 'blocked' value: must be true or false"}), 400

    user = User.query.get_or_404(id)
    user.blocked = blocked_status
    db.session.commit()

    status = "blocked" if blocked_status else "unblocked"
    
    msg = Message(
        subject="Account Status Update",    
        recipients=[user.email],
        body=f"""Hello {user.username}, 
Your account has been {'blocked' if blocked_status else 'unblocked'} by an admin.
Please contact support if you have any questions.
Thank you,
The Beauty Shop Team
        """.strip()
    )
    try:
        current_app.extensions['mail'].send(msg)
    except Exception as e:
        return jsonify({"error": f"User {status} but failed to send email: {str(e)}"}), 500
    return jsonify({"message": f"User {status} successfully"}), 200



@user_bp.route('/register/order_manager', methods=['POST'])
@jwt_required()
def register_order_manager():
    if not is_admin():
        return jsonify({"error": "Only admin can register order managers"}), 403

    data = request.get_json()
    email = data.get('email')
    username = data.get('username') or email.split('@')[0]

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User with this email already exists"}), 409

    otp = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    hashed_password = generate_password_hash(otp)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        role='order_manager'
    )
    db.session.add(new_user)
    db.session.commit()

    msg = Message(
        subject="Welcome to Beauty Shop - Order Manager Access",
        recipients=[email],
        body=f"""
Hello {username},

You have been registered as an Order Manager.
Your temporary password is: {otp}

Please log in and change your password immediately.
        """.strip()
    )

    try:
        current_app.extensions['mail'].send(msg)
        return jsonify({
            "message": f"Order Manager registered and email sent to {email}",
            "email": email
        }), 201
    except Exception as e:
        return jsonify({"error": f"User created but failed to send email: {str(e)}"}), 500
