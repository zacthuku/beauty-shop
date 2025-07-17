from flask import Blueprint, jsonify, request, abort
from models import db, Invoice, Order, OrderItem, Product, User
from datetime import datetime

invoice_bp = Blueprint('invoices', __name__)

# Get invoice by ID
@invoice_bp.route('/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        abort(404, description="Invoice not found")

    order = invoice.order
    user = order.user
    items = []

    for item in order.order_items:
        product = item.product
        items.append({
            "product_name": product.name,
            "quantity": item.quantity,
            "unit_price": product.price,
            "total": product.price * item.quantity
        })

    invoice_data = {
        "invoice_id": invoice.id,
        "order_id": order.id,
        "customer": {
            "name": user.name,
            "email": user.email
        },
        "order_date": order.created_at.strftime("%Y-%m-%d"),
        "items": items,
        "total_amount": invoice.total_amount,
        "status": invoice.status,
    }

    return jsonify(invoice_data), 200

# Generate invoice for an order
@invoice_bp.route('/invoices', methods=['POST'])
def create_invoice():
    data = request.get_json()
    order_id = data.get("order_id")

    order = Order.query.get(order_id)
    if not order:
        abort(404, description="Order not found")

    # Prevent duplicate invoices for the same order
    existing = Invoice.query.filter_by(order_id=order.id).first()
    if existing:
        abort(400, description="Invoice already exists for this order")

    # Calculate total
    total_amount = sum(
        item.product.price * item.quantity for item in order.order_items
    )

    new_invoice = Invoice(
        order_id=order.id,
        total_amount=total_amount,
        status="Pending",
        created_at=datetime.utcnow()
    )

    db.session.add(new_invoice)
    db.session.commit()

    return jsonify({
        "message": "Invoice created successfully",
        "invoice_id": new_invoice.id,
        "total": total_amount
    }), 201
