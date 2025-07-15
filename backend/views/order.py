from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, Product, Order, OrderItem, Invoice
from datetime import datetime
import uuid

order_bp = Blueprint('order', __name__, url_prefix='/orders')

@order_bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    user_id = get_jwt_identity()['id']
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in cart_items])

@order_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    item = CartItem.query.filter_by(user_id=user_id, product_id=data['product_id']).first()
    if item:
        item.quantity += data['quantity']
    else:
        item = CartItem(user_id=user_id, product_id=data['product_id'], quantity=data['quantity'])
        db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@order_bp.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    item = CartItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"})

@order_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Cart is empty"}), 400

    total_price = sum(item.product.price * item.quantity for item in cart_items)
    order = Order(
        user_id=user_id,
        status='Processing',
        total_price=total_price,
        delivery_address=data.get('delivery_address'),
        billing_info=data.get('billing_info')
    )
    db.session.add(order)
    db.session.flush()

    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_order=item.product.price
        )
        db.session.add(order_item)
        db.session.delete(item)

    # Simulate invoice generation
    invoice = Invoice(
        invoice_number=str(uuid.uuid4())[:8],
        order_id=order.id,
        pdf_url=f"/invoices/{order.id}.pdf"
    )
    db.session.add(invoice)
    db.session.commit()
    return jsonify(order.to_dict()), 201
