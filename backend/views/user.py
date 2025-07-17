from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db,User

from flask_mail import Message
from werkzeug.security import generate_password_hash
import random
import string

from mail_config import mail
from models import db, User


user_bp = Blueprint('user', __name__, url_prefix='/users')

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()['id']
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_users():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@user_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
@user_bp.route('/<int:id>/block', methods=['POST'])
@jwt_required()
def toggle_block_user(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    data = request.get_json()
    blocked_status = data.get('blocked')

    if blocked_status not in [True, False]:
        return jsonify({"error": "Missing or invalid 'blocked' value (true or false required)"}), 400

    user = User.query.get_or_404(id)
    user.blocked = blocked_status
    db.session.commit()

    status = "blocked" if blocked_status else "unblocked"
    return jsonify({"message": f"User {status} successfully"}), 200

@user_bp.route('/<int:user_id>/email', methods=['POST'])
@jwt_required()
def send_email_to_user(user_id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    user = User.query.get_or_404(user_id)
    data = request.get_json()

    subject = data.get("subject")
    body = data.get("body")

    if not subject or not body:
        return jsonify({"error": "Subject and body are required"}), 400

    msg = Message(subject, recipients=[user.email], body=body)

    try:
        mail.send(msg)
        return jsonify({"message": f"Email sent to {user.email}"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
@user_bp.route('/register/order_manager', methods=['POST'])
@jwt_required()
def register_order_manager():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Only admin can register order managers"}), 403

    data = request.get_json()
    email = data.get('email')
    username = data.get('username')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "User with this email already exists"}), 409

    otp = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    hashed_password = generate_password_hash(otp)

    new_user = User(username = email.split('@')[0],email=email, password_hash=hashed_password, role='order_manager')
    db.session.add(new_user)
    db.session.commit()

    try:
        msg = Message(
            subject="Welcome to Beauty Shop - Order Manager Access",
            recipients=[email],
            body=f"Hello,\n\nYou have been registered as an Order Manager.\nYour temporary password is: {otp}\n\nPlease log in and change your password immediately."
        )
        mail.send(msg)
        return jsonify({
            "message": f"Order Manager registered and email sent to {email}",
            "email": email
        }), 201
    except Exception as e:
        return jsonify({"error": f"User created but failed to send email: {str(e)}"}), 500

