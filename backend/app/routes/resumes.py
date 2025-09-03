from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Resume, Section, User
from .. import db
from datetime import datetime
import re
from urllib.parse import unquote

bp = Blueprint('resumes', __name__)

def slugify(text):
    """Convert text to a URL-friendly slug."""
    text = unquote(text.lower())
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-_')
    return text

@bp.route('', methods=['POST'])
@jwt_required()
def create_resume():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'title' not in data:
        return {'error': 'Missing required fields'}, 400
    
    # Generate a slug from the title
    slug = slugify(data['title'])
    
    # Ensure slug is unique
    count = 1
    original_slug = slug
    while Resume.query.filter_by(slug=slug).first() is not None:
        slug = f"{original_slug}-{count}"
        count += 1
    
    try:
        resume = Resume(
            title=data['title'],
            slug=slug,
            theme=data.get('theme', 'classic'),
            user_id=current_user_id
        )
        
        db.session.add(resume)
        db.session.commit()
        
        return jsonify(resume.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating resume: {str(e)}')
        return {'error': 'Failed to create resume'}, 500

@bp.route('', methods=['GET'])
@jwt_required()
def get_resumes():
    current_user_id = get_jwt_identity()
    
    try:
        resumes = Resume.query.filter_by(user_id=current_user_id).all()
        return jsonify([r.to_dict() for r in resumes]), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching resumes: {str(e)}')
        return {'error': 'Failed to fetch resumes'}, 500

@bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            return {'error': 'Resume not found'}, 404
        
        return jsonify(resume.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching resume: {str(e)}')
        return {'error': 'Failed to fetch resume'}, 500

@bp.route('/<int:resume_id>', methods=['PUT'])
@jwt_required()
def update_resume(resume_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            return {'error': 'Resume not found'}, 404
        
        if 'title' in data:
            resume.title = data['title']
            # Update slug if title changes
            resume.slug = slugify(data['title'])
        
        if 'theme' in data:
            resume.theme = data['theme']
        
        resume.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(resume.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating resume: {str(e)}')
        return {'error': 'Failed to update resume'}, 500

@bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            return {'error': 'Resume not found'}, 404
        
        db.session.delete(resume)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting resume: {str(e)}')
        return {'error': 'Failed to delete resume'}, 500

@bp.route('/<int:resume_id>/duplicate', methods=['POST'])
@jwt_required()
def duplicate_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    try:
        original = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not original:
            return {'error': 'Resume not found'}, 404
        
        # Create a new resume with "Copy of" prefix
        new_title = f"Copy of {original.title}"
        new_slug = slugify(new_title)
        
        # Ensure slug is unique
        count = 1
        original_slug = new_slug
        while Resume.query.filter_by(slug=new_slug).first() is not None:
            new_slug = f"{original_slug}-{count}"
            count += 1
        
        # Create new resume
        new_resume = Resume(
            title=new_title,
            slug=new_slug,
            theme=original.theme,
            user_id=current_user_id
        )
        
        db.session.add(new_resume)
        db.session.flush()  # Get the new_resume.id
        
        # Duplicate sections and entries
        for section in original.sections:
            new_section = Section(
                title=section.title,
                order=section.order,
                resume_id=new_resume.id
            )
            db.session.add(new_section)
            db.session.flush()
            
            for entry in section.entries:
                new_entry = Entry(
                    title=entry.title,
                    subtitle=entry.subtitle,
                    description=entry.description,
                    start_date=entry.start_date,
                    end_date=entry.end_date,
                    current=entry.current,
                    order=entry.order,
                    section_id=new_section.id
                )
                db.session.add(new_entry)
        
        db.session.commit()
        
        return jsonify(new_resume.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error duplicating resume: {str(e)}')
        return {'error': 'Failed to duplicate resume'}, 500

@bp.route('/<int:resume_id>/export/pdf', methods=['GET'])
@jwt_required()
def export_pdf(resume_id):
    current_user_id = get_jwt_identity()
    
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            return {'error': 'Resume not found'}, 404
        
        # This is a placeholder for the actual PDF generation
        # In a real implementation, you would use WeasyPrint or another library
        # to generate a PDF from the resume data
        
        # For now, return a success message with the resume data
        return jsonify({
            'message': 'PDF export would be generated here',
            'resume': resume.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f'Error exporting resume: {str(e)}')
        return {'error': 'Failed to export resume'}, 500
