from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Section, Entry, Resume
from .. import db
from datetime import datetime

bp = Blueprint('sections', __name__)

def get_resume_for_user(user_id, resume_id):
    """Helper function to get a resume if it belongs to the user."""
    return Resume.query.filter_by(id=resume_id, user_id=user_id).first()

# Section Routes
@bp.route('/<int:resume_id>/sections', methods=['POST'])
@jwt_required()
def create_section(resume_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume exists and belongs to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    if not data or 'title' not in data:
        return {'error': 'Missing required fields'}, 400
    
    try:
        # Get the maximum order value for sections in this resume
        max_order = db.session.query(db.func.max(Section.order)).filter_by(resume_id=resume_id).scalar() or 0
        
        section = Section(
            title=data['title'],
            order=max_order + 1,
            resume_id=resume_id
        )
        
        db.session.add(section)
        db.session.commit()
        
        return jsonify(section.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating section: {str(e)}')
        return {'error': 'Failed to create section'}, 500

@bp.route('/<int:resume_id>/sections', methods=['GET'])
@jwt_required()
def get_sections(resume_id):
    current_user_id = get_jwt_identity()
    
    # Check if resume exists and belongs to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    try:
        sections = Section.query.filter_by(resume_id=resume_id).order_by(Section.order).all()
        return jsonify([s.to_dict() for s in sections]), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching sections: {str(e)}')
        return {'error': 'Failed to fetch sections'}, 500

@bp.route('/<int:resume_id>/sections/order', methods=['PUT'])
@jwt_required()
def update_sections_order(resume_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume exists and belongs to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    if not data or 'sections' not in data:
        return {'error': 'Missing required fields'}, 400
    
    try:
        # Update the order of sections
        for section_data in data['sections']:
            section = Section.query.filter_by(id=section_data['id'], resume_id=resume_id).first()
            if section:
                section.order = section_data['order']
        
        db.session.commit()
        
        # Return the updated list of sections
        sections = Section.query.filter_by(resume_id=resume_id).order_by(Section.order).all()
        return jsonify([s.to_dict() for s in sections]), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating sections order: {str(e)}')
        return {'error': 'Failed to update sections order'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>', methods=['PUT'])
@jwt_required()
def update_section(resume_id, section_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume exists and belongs to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    try:
        if 'title' in data:
            section.title = data['title']
        
        if 'order' in data:
            section.order = data['order']
        
        section.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(section.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating section: {str(e)}')
        return {'error': 'Failed to update section'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>', methods=['DELETE'])
@jwt_required()
def delete_section(resume_id, section_id):
    current_user_id = get_jwt_identity()
    
    # Check if resume exists and belongs to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    try:
        # Delete all entries in this section first
        Entry.query.filter_by(section_id=section_id).delete()
        
        # Then delete the section
        db.session.delete(section)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting section: {str(e)}')
        return {'error': 'Failed to delete section'}, 500

# Entry Routes
@bp.route('/<int:resume_id>/sections/<int:section_id>/entries', methods=['POST'])
@jwt_required()
def create_entry(resume_id, section_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume and section exist and belong to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    if not data or 'title' not in data:
        return {'error': 'Missing required fields'}, 400
    
    try:
        # Get the maximum order value for entries in this section
        max_order = db.session.query(db.func.max(Entry.order))\
            .filter_by(section_id=section_id).scalar() or 0
        
        entry = Entry(
            title=data['title'],
            subtitle=data.get('subtitle', ''),
            description=data.get('description', ''),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            current=data.get('current', False),
            order=max_order + 1,
            section_id=section_id
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating entry: {str(e)}')
        return {'error': 'Failed to create entry'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>/entries', methods=['GET'])
@jwt_required()
def get_entries(resume_id, section_id):
    current_user_id = get_jwt_identity()
    
    # Check if resume and section exist and belong to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    try:
        entries = Entry.query.filter_by(section_id=section_id).order_by(Entry.order).all()
        return jsonify([e.to_dict() for e in entries]), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching entries: {str(e)}')
        return {'error': 'Failed to fetch entries'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>/entries/order', methods=['PUT'])
@jwt_required()
def update_entries_order(resume_id, section_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume and section exist and belong to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    if not data or 'entries' not in data:
        return {'error': 'Missing required fields'}, 400
    
    try:
        # Update the order of entries
        for entry_data in data['entries']:
            entry = Entry.query.filter_by(id=entry_data['id'], section_id=section_id).first()
            if entry:
                entry.order = entry_data['order']
        
        db.session.commit()
        
        # Return the updated list of entries
        entries = Entry.query.filter_by(section_id=section_id).order_by(Entry.order).all()
        return jsonify([e.to_dict() for e in entries]), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating entries order: {str(e)}')
        return {'error': 'Failed to update entries order'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>/entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(resume_id, section_id, entry_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if resume and section exist and belong to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    entry = Entry.query.filter_by(id=entry_id, section_id=section_id).first()
    if not entry:
        return {'error': 'Entry not found'}, 404
    
    try:
        if 'title' in data:
            entry.title = data['title']
        
        if 'subtitle' in data:
            entry.subtitle = data['subtitle']
        
        if 'description' in data:
            entry.description = data['description']
        
        if 'start_date' in data:
            entry.start_date = data['start_date']
        
        if 'end_date' in data:
            entry.end_date = data['end_date']
        
        if 'current' in data:
            entry.current = data['current']
        
        if 'order' in data:
            entry.order = data['order']
        
        entry.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(entry.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating entry: {str(e)}')
        return {'error': 'Failed to update entry'}, 500

@bp.route('/<int:resume_id>/sections/<int:section_id>/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(resume_id, section_id, entry_id):
    current_user_id = get_jwt_identity()
    
    # Check if resume and section exist and belong to user
    resume = get_resume_for_user(current_user_id, resume_id)
    if not resume:
        return {'error': 'Resume not found'}, 404
    
    section = Section.query.filter_by(id=section_id, resume_id=resume_id).first()
    if not section:
        return {'error': 'Section not found'}, 404
    
    entry = Entry.query.filter_by(id=entry_id, section_id=section_id).first()
    if not entry:
        return {'error': 'Entry not found'}, 404
    
    try:
        db.session.delete(entry)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting entry: {str(e)}')
        return {'error': 'Failed to delete entry'}, 500
