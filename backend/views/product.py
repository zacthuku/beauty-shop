from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Product, Category

product_bp = Blueprint('product', __name__, url_prefix='/products')

@product_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@product_bp.route('/', methods=['POST'])
@jwt_required()
def add_product():
    if get_jwt_identity()['role'] != 'admin'and get_jwt_identity()['role'] != 'order_manager':
        return jsonify({"error": "Permission denied"}), 403
    data = request.get_json()
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@product_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    if get_jwt_identity()['role'] != 'admin' and get_jwt_identity()['role'] != 'order_manager':
        return jsonify({"error": "Permission denied"}), 403
    product = Product.query.get_or_404(id)
    data = request.get_json()
    for field in ['name', 'description', 'price', 'stock_quantity', 'category_id']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify(product.to_dict())

@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    if get_jwt_identity()['role'] != 'admin' and get_jwt_identity()['role'] != 'order_manager':
        return jsonify({"error": "Permission denied"}), 403
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})
