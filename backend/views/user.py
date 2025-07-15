from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
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
