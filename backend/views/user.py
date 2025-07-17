from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db,User

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
