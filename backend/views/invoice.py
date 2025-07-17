from flask import Blueprint, jsonify, request, abort
from models import db, Invoice, Order, OrderItem, Product, User
from datetime import datetime
from flask_mail import Message
from mail_config import mail

invoice_bp = Blueprint('invoices', __name__)

# ✉️ Email invoice to user
@invoice_bp.route('/invoices/<int:invoice_id>/email', methods=['POST'])
def email_invoice(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        abort(404, description="Invoice not found")

    order = invoice.order
    user = order.user

    # Build the invoice content
    items = []
    for item in order.order_items:
        product = item.product
        items.append(
            f"{product.name} - {item.quantity} x ${product.price:.2f} = ${product.price * item.quantity:.2f}"
        )

    item_lines = "\n".join(items)

    subject = f"Your Invoice #{invoice.id} - Beauty Shop"
    body = f"""
Hello {user.name},

Thank you for your order!

Here are your invoice details:

Invoice ID: {invoice.id}
Order ID: {order.id}
Order Date: {order.created_at.strftime('%Y-%m-%d')}

Items:
{item_lines}

Total Amount: ${invoice.total_amount:.2f}
Status: {invoice.status}

We appreciate your business!

Regards,
Beauty Shop Team
    """

    msg = Message(subject, recipients=[user.email], body=body)
    try:
        mail.send(msg)
        return jsonify({"message": f"Invoice emailed to {user.email}"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
