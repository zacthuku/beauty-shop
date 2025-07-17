from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, Product

cart_bp = Blueprint('cart_bp', __name__, url_prefix='/cart')

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def view_cart():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in cart_items]), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify(cart_item.to_dict()), 201

@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200

@cart_bp.route('/update/<int:item_id>', methods=['PATCH'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    new_quantity = data.get("quantity")

    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    if not isinstance(new_quantity, int) or new_quantity < 1:
        return jsonify({"error": "Quantity must be a positive integer"}), 400

    cart_item.quantity = new_quantity
    db.session.commit()
    return jsonify(cart_item.to_dict()), 200