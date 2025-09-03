from datetime import datetime, timezone
from .. import db

class Section(db.Model):
    __tablename__ = 'sections'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), 
                         onupdate=lambda: datetime.now(timezone.utc))
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    
    # Relationships
    entries = db.relationship('Entry', backref='section', lazy='dynamic',
                            cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Section {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'order': self.order,
            'resume_id': self.resume_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'entries': [entry.to_dict() for entry in self.entries.order_by(Entry.order)]
        }
