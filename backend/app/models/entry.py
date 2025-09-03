from datetime import datetime, timezone
from .. import db

class Entry(db.Model):
    __tablename__ = 'entries'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(200))
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    current = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), 
                         onupdate=lambda: datetime.now(timezone.utc))
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    
    def __repr__(self):
        return f'<Entry {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'current': self.current,
            'order': self.order,
            'section_id': self.section_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
