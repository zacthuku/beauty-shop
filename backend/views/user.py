from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from mail_config import mail
from models import User

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
