# routes/cart.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, Product

cart_bp = Blueprint('cart', __name__, url_prefix='/cart')

@cart_bp.route('', methods=['GET'])
@jwt_required()
def view_cart():
    try:
        # Get user identity - handle both dict and direct ID formats
        user_identity = get_jwt_identity()
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "Invalid token format"}), 401
        
        # Query cart items with product information
        cart_items = CartItem.query.filter_by(user_id=user_id).join(Product).all()
        
        # Return empty array if no items found
        return jsonify([item.to_dict() for item in cart_items])
    
    except Exception as e:
        print(f"Error in view_cart: {str(e)}")
        return jsonify({"error": "Failed to fetch cart", "details": str(e)}), 500

@cart_bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        # Get user identity - handle both dict and direct ID formats
        user_identity = get_jwt_identity()
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "Invalid token format"}), 401
        
        data = request.get_json()
        
        # Validate required fields
        if not data or 'product_id' not in data or 'quantity' not in data:
            return jsonify({"error": "product_id and quantity are required"}), 400
        
        product_id = data['product_id']
        quantity = data['quantity']
        
        # Validate quantity
        if not isinstance(quantity, int) or quantity < 1:
            return jsonify({"error": "quantity must be a positive integer"}), 400
        
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        
        if existing_item:
            # Update existing item
            existing_item.quantity += quantity
            db.session.commit()
            return jsonify(existing_item.to_dict()), 200
        else:
            # Create new cart item
            new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
            db.session.add(new_item)
            db.session.commit()
            return jsonify(new_item.to_dict()), 201
    
    except Exception as e:
        print(f"Error in add_to_cart: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to add to cart", "details": str(e)}), 500

@cart_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    try:
        # Get user identity - handle both dict and direct ID formats
        user_identity = get_jwt_identity()
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "Invalid token format"}), 401
        
        # Find the cart item and ensure it belongs to the current user
        item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
        
        if not item:
            return jsonify({"error": "Cart item not found"}), 404
        
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item removed successfully"}), 200
    
    except Exception as e:
        print(f"Error in remove_from_cart: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to remove item", "details": str(e)}), 500

@cart_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Update quantity of a specific cart item"""
    try:
        # Get user identity - handle both dict and direct ID formats
        user_identity = get_jwt_identity()
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "Invalid token format"}), 401
        
        data = request.get_json()
        
        if not data or 'quantity' not in data:
            return jsonify({"error": "quantity is required"}), 400
        
        quantity = data['quantity']
        
        # Validate quantity
        if not isinstance(quantity, int) or quantity < 1:
            return jsonify({"error": "quantity must be a positive integer"}), 400
        
        # Find the cart item and ensure it belongs to the current user
        item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
        
        if not item:
            return jsonify({"error": "Cart item not found"}), 404
        
        item.quantity = quantity
        db.session.commit()
        return jsonify(item.to_dict()), 200
    
    except Exception as e:
        print(f"Error in update_cart_item: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to update item", "details": str(e)}), 500

@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear all items from user's cart"""
    try:
        # Get user identity - handle both dict and direct ID formats
        user_identity = get_jwt_identity()
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "Invalid token format"}), 401
        
        # Delete all cart items for the user
        CartItem.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({"message": "Cart cleared successfully"}), 200
    
    except Exception as e:
        print(f"Error in clear_cart: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to clear cart", "details": str(e)}), 500