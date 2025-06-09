from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User, GeneratedCode
from forms import RegistrationForm, LoginForm, CodeGenerationForm, ComplexRequestForm
from gemini_service import gemini_service
from export_service import export_service
from email_service import email_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Landing page"""
    return render_template('index.html')

@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if 'user_id' in session:
        return redirect(url_for('main.generator'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        try:
            user = User(username=form.username.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('main.login'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Registration error: {str(e)}")
            flash('Registration failed. Please try again.', 'error')
    
    return render_template('register.html', form=form)

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if 'user_id' in session:
        return redirect(url_for('main.generator'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('main.generator'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html', form=form)

@main_bp.route('/logout')
def logout():
    """User logout"""
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.index'))

@main_bp.route('/generator', methods=['GET', 'POST'])
def generator():
    """Code generation page"""
    form = CodeGenerationForm()
    generated_code = None
    code_type = None
    code_id = None
    
    if form.validate_on_submit():
        # Generate code using Gemini API
        result = gemini_service.generate_code(form.prompt.data, form.language.data)
        
        if result['success']:
            generated_code = result['code']
            code_type = 'html' if form.language.data == 'html' else 'snippet'
            
            # Save to database if user is logged in
            if 'user_id' in session:
                try:
                    code_entry = GeneratedCode(
                        user_id=session['user_id'],
                        prompt=form.prompt.data,
                        language=form.language.data,
                        code=generated_code,
                        code_type=code_type
                    )
                    db.session.add(code_entry)
                    db.session.commit()
                    code_id = code_entry.id
                except Exception as e:
                    logger.error(f"Error saving code to database: {str(e)}")
                    db.session.rollback()
            
            flash('Code generated successfully!', 'success')
        else:
            flash(f'Code generation failed: {result["error"]}', 'error')
    
    return render_template('generator.html', 
                         form=form, 
                         generated_code=generated_code, 
                         code_type=code_type,
                         language=form.language.data if form.language.data else None,
                         code_id=code_id)

@main_bp.route('/history')
def history():
    """User's code generation history"""
    if 'user_id' not in session:
        flash('Please log in to view your history.', 'warning')
        return redirect(url_for('main.login'))
    
    user_codes = GeneratedCode.query.filter_by(user_id=session['user_id']).order_by(GeneratedCode.created_at.desc()).all()
    return render_template('history.html', codes=user_codes)

@main_bp.route('/view_code/<int:code_id>')
def view_code(code_id):
    """View a specific generated code"""
    if 'user_id' not in session:
        flash('Please log in to view code.', 'warning')
        return redirect(url_for('main.login'))
    
    code = GeneratedCode.query.filter_by(id=code_id, user_id=session['user_id']).first_or_404()
    return render_template('generator.html', 
                         form=CodeGenerationForm(), 
                         generated_code=code.code, 
                         code_type=code.code_type,
                         language=code.language,
                         prompt=code.prompt,
                         code_id=code_id)

@main_bp.route('/export/<int:code_id>/<format>')
def export_code(code_id, format):
    """Export code in specified format (text or pdf)"""
    if 'user_id' not in session:
        flash('Please log in to export code.', 'warning')
        return redirect(url_for('main.login'))
    
    # Get the code entry
    code = GeneratedCode.query.filter_by(id=code_id, user_id=session['user_id']).first_or_404()
    
    # Prepare export data
    export_data = {
        'title': f"{code.language.upper()} Code - {code.prompt[:50]}...",
        'language': code.language,
        'prompt': code.prompt,
        'code': code.code,
        'created_at': code.created_at
    }
    
    try:
        if format.lower() == 'text':
            return export_service.export_as_text(export_data)
        elif format.lower() == 'pdf':
            return export_service.export_as_pdf(export_data)
        else:
            flash('Invalid export format requested.', 'error')
            return redirect(url_for('main.view_code', code_id=code_id))
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        flash('Failed to export code. Please try again.', 'error')
        return redirect(url_for('main.view_code', code_id=code_id))

@main_bp.route('/export_session/<format>', methods=['POST'])
def export_session_code(format):
    """Export code from current session (for non-saved code)"""
    try:
        # Get code data from form
        code_data = request.get_json()
        
        if not code_data or not all(k in code_data for k in ['code', 'language', 'prompt']):
            return jsonify({'error': 'Invalid code data'}), 400
        
        # Prepare export data
        export_data = {
            'title': f"{code_data['language'].upper()} Code - {code_data['prompt'][:50]}...",
            'language': code_data['language'],
            'prompt': code_data['prompt'],
            'code': code_data['code']
        }
        
        if format.lower() == 'text':
            return export_service.export_as_text(export_data)
        elif format.lower() == 'pdf':
            return export_service.export_as_pdf(export_data)
        else:
            return jsonify({'error': 'Invalid export format'}), 400
            
    except Exception as e:
        logger.error(f"Session export error: {str(e)}")
        return jsonify({'error': 'Export failed'}), 500

@main_bp.route('/complex-request', methods=['GET', 'POST'])
def complex_request():
    """Complex code request form"""
    form = ComplexRequestForm()
    
    if form.validate_on_submit():
        try:
            # Prepare email data
            project_types = dict(form.project_type.choices)
            languages = dict(form.languages.choices)
            timelines = dict(form.timeline.choices)
            budgets = dict(form.budget.choices)
            
            user_data = {
                'name': form.name.data,
                'email': form.email.data,
                'phone': form.phone.data,
                'project_type': project_types.get(form.project_type.data, form.project_type.data),
                'languages': [languages.get(form.languages.data, form.languages.data)],
                'timeline': timelines.get(form.timeline.data, form.timeline.data),
                'budget': budgets.get(form.budget.data, form.budget.data),
                'description': form.description.data,
                'requirements': form.requirements.data,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Send email to support team
            result = email_service.send_complex_request(user_data)
            
            if result['success']:
                # Note: Confirmation email disabled due to Resend domain restrictions
                # email_service.send_confirmation_email(form.email.data, form.name.data)
                
                flash('Your request has been submitted successfully! Our team will contact you within 24-48 hours at the email address you provided.', 'success')
                return redirect(url_for('main.index'))
            else:
                flash(f'Failed to submit request: {result["error"]}', 'error')
                
        except Exception as e:
            logger.error(f"Complex request submission error: {str(e)}")
            flash('An error occurred while submitting your request. Please try again.', 'error')
    
    return render_template('complex_request.html', form=form)
