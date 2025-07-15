from flask import Blueprint

category_bp = Blueprint('category', __name__, url_prefix='/categories')

@category_bp.route('/', methods=['GET'])
def list_categories():
    return {"message": "Category list placeholder"}
