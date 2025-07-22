from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from models import db,User
from flask_mail import Message
from werkzeug.security import generate_password_hash
from models import db, User
import random
import string
from models import db, User




user_bp = Blueprint('user', __name__, url_prefix='/users')

@user_bp.route('', methods=['GET']) 
@jwt_required()
def get_all_users():
    if not is_admin():
        return jsonify({"error": "Admin only"}), 403

    users = User.query.all()
    return jsonify({"users": [u.to_dict() for u in users]}) 

@user_bp.route('/<int:id>/block', methods=['PATCH']) 
@jwt_required()
def toggle_block_user(id):
    if not is_admin():
        return jsonify({"error": "Admin only"}), 403

    user = User.query.get_or_404(id)
    user.blocked = not user.blocked  
    db.session.commit()

    status = "blocked" if user.blocked else "unblocked"
    return jsonify({
        "message": f"User {status} successfully",
        "user": user.to_dict()
    }), 200



@user_bp.route('/create-manager', methods=['POST'])
@jwt_required()
def create_manager():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"error": "Admin only"}), 403

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if User.query.filter_by(email=email).first():
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
