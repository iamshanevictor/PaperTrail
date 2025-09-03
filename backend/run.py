import os
from app import create_app, db
from app.models.user import User
from app.models.resume import Resume
from app.models.section import Section
from app.models.entry import Entry

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Resume': Resume,
        'Section': Section,
        'Entry': Entry
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
