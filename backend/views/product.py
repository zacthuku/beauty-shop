from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Product, Category

product_bp = Blueprint('product', __name__, url_prefix='/products')

@product_bp.route('/', methods=['GET'])
def get_products():
    search = request.args.get("search", "", type=str).lower()
    category_name = request.args.get("category", "all", type=str).lower()
    sort = request.args.get("sort", "name", type=str).lower()

    query = Product.query.join(Category)

    if category_name != "all":
        query = query.filter(Category.name.ilike(category_name))

    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )

    sort_map = {
        "price-low": Product.price.asc(),
        "price-high": Product.price.desc(),
        "rating": Product.rating.desc(),
        "newest": Product.id.desc(),
        "name": Product.name.asc(),
    }
    sort_criteria = sort_map.get(sort, Product.name.asc())
    query = query.order_by(sort_criteria)

    products = query.all()
    return jsonify([p.to_dict() for p in products])


@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "label": c.label,
            "icon": c.icon
        }
        for c in categories
    ])


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
