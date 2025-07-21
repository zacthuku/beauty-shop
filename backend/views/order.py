from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from models import db, CartItem, Product, Order, OrderItem, Invoice, User
from datetime import datetime
import uuid
import os

order_bp = Blueprint('order', __name__, url_prefix='/orders')


def is_admin():
    identity = get_jwt_identity()
    user_id = identity['id'] if isinstance(identity, dict) else identity
    user = User.query.get(user_id)
    return user and user.role == "admin"


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
#get order details and checkout
@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_details(order_id):
    order = Order.query.get_or_404(order_id)
    if not is_admin() and order.user_id != get_jwt_identity()['id']:
        return jsonify({"error": "Unauthorized access"}), 403
    return jsonify(order.to_dict()) 

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
        status='Pending Payment',
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

    invoice_number = str(uuid.uuid4())[:8]
    pdf_url = f"/invoices/{order.id}.pdf"
    invoice = Invoice(
        invoice_number=invoice_number,
        order_id=order.id,
        pdf_url=pdf_url,
        amount=total_price
    )
    db.session.add(invoice)
    db.session.commit()

    items_details = "\n".join(
        f"- {item.product.name} × {item.quantity} @ Ksh {item.product.price:.2f}"
        for item in cart_items)

    user = User.query.get(user_id)
    msg = Message(
        subject=f"Order Confirmation - Order #{order.id} | Beauty Shop",
        recipients=[user.email],
        body=f"""Hello {user.username},

Thank you for your order with Beauty Shop! 

Order ID: {order.id}  
Status: {order.status}  
Total Amount: Ksh {total_price:.2f}

Items in your order:
{items_details}

Your order is currently marked as *Pending Payment*.

To complete your order, please make payment via M-Pesa:

📲 M-Pesa Payment Instructions:
- Go to M-Pesa > Lipa na M-Pesa > Paybill
- Paybill Number: 123456
- Account Number: ORDER{order.id}
- Amount: Ksh {total_price:.2f}

Once payment is confirmed, we will begin processing your order.

If you have any questions or need assistance, contact us at support@beautyshop.co.ke.

We truly appreciate your business!

Warm regards,  
Beauty Shop Team  
www.beautyshop.co.ke
"""
    )
    mail.send(msg)

    return jsonify(order.to_dict()), 201


@order_bp.route('/history', methods=['GET'])
@jwt_required()
def view_purchase_history():
    identity = get_jwt_identity()
    user_id = identity['id'] if isinstance(identity, dict) else identity

    if is_admin():
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=user_id).all()

    return jsonify([order.to_dict() for order in orders])
