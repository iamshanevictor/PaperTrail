from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, get_jwt_identity, jwt_required
)
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User
from .. import db
from email_validator import validate_email, EmailNotValidError

bp = Blueprint('auth', __name__)

def validate_email_address(email):
    try:
        # Validate the email
        valid = validate_email(email)
        # Update with the normalized form of the email
        return valid.email
    except EmailNotValidError as e:
        return False

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['username', 'email', 'password']):
        return {'error': 'Missing required fields'}, 400
    
    # Validate email
    email = validate_email_address(data['email'])
    if not email:
        return {'error': 'Invalid email address'}, 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return {'error': 'Username already exists'}, 400
    if User.query.filter_by(email=email).first():
        return {'error': 'Email already registered'}, 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=email
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Generate access token
        access_token = user.get_token()
        return {
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Registration error: {str(e)}')
        return {'error': 'Registration failed'}, 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'password']):
        return {'error': 'Missing email or password'}, 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        access_token = user.get_token()
        return {
            'access_token': access_token,
            'user': user.to_dict()
        }, 200
    
    return {'error': 'Invalid email or password'}, 401

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return {'user': user.to_dict()}, 200

@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    data = request.get_json()
    if not all(k in data for k in ['current_password', 'new_password']):
        return {'error': 'Missing required fields'}, 400
    
    if not user.check_password(data['current_password']):
        return {'error': 'Current password is incorrect'}, 401
    
    try:
        user.set_password(data['new_password'])
        db.session.commit()
        return {'message': 'Password updated successfully'}, 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Password change error: {str(e)}')
        return {'error': 'Failed to update password'}, 500
