from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField, SubmitField
from wtforms.validators import DataRequired, Length, Regexp, EqualTo, ValidationError
from models import User

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[
        DataRequired(),
        Length(min=4, max=20),
        Regexp(r'^[a-zA-Z0-9]{4,20}$', message='Username must be 4-20 alphanumeric characters')
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8, max=50),
        Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$', 
               message='Password must contain uppercase, lowercase, number, and special character')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already exists. Please choose a different one.')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class CodeGenerationForm(FlaskForm):
    prompt = TextAreaField('Prompt', validators=[
        DataRequired(),
        Length(min=10, max=1000, message='Prompt must be between 10 and 1000 characters')
    ])
    language = SelectField('Language', choices=[
        ('html', 'Static HTML Page'),
        ('javascript', 'JavaScript'),
        ('python', 'Python'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('c', 'C')
    ], validators=[DataRequired()])
    submit = SubmitField('Generate Code')

class ComplexRequestForm(FlaskForm):
    name = StringField('Full Name', validators=[
        DataRequired(),
        Length(min=2, max=100)
    ])
    email = StringField('Email Address', validators=[
        DataRequired(),
        Length(min=6, max=100)
    ])
    phone = StringField('Phone Number (Optional)', validators=[
        Length(max=20)
    ])
    project_type = SelectField('Project Type', choices=[
        ('web_application', 'Web Application'),
        ('mobile_app', 'Mobile Application'),
        ('desktop_software', 'Desktop Software'),
        ('api_development', 'API Development'),
        ('data_analysis', 'Data Analysis & ML'),
        ('automation_script', 'Automation Scripts'),
        ('database_design', 'Database Design'),
        ('other', 'Other')
    ], validators=[DataRequired()])
    languages = SelectField('Primary Programming Languages', choices=[
        ('python', 'Python'),
        ('javascript', 'JavaScript/TypeScript'),
        ('java', 'Java'),
        ('csharp', 'C#'),
        ('cpp', 'C++'),
        ('php', 'PHP'),
        ('ruby', 'Ruby'),
        ('go', 'Go'),
        ('rust', 'Rust'),
        ('swift', 'Swift'),
        ('kotlin', 'Kotlin'),
        ('multiple', 'Multiple Languages')
    ], validators=[DataRequired()])
    timeline = SelectField('Expected Timeline', choices=[
        ('asap', 'ASAP (Rush Job)'),
        ('1_week', '1 Week'),
        ('2_weeks', '2 Weeks'),
        ('1_month', '1 Month'),
        ('2_months', '2 Months'),
        ('3_months', '3+ Months'),
        ('flexible', 'Flexible Timeline')
    ], validators=[DataRequired()])
    budget = SelectField('Budget Range', choices=[
        ('under_500', 'Under $500'),
        ('500_1000', '$500 - $1,000'),
        ('1000_2500', '$1,000 - $2,500'),
        ('2500_5000', '$2,500 - $5,000'),
        ('5000_10000', '$5,000 - $10,000'),
        ('over_10000', 'Over $10,000'),
        ('discuss', 'Let\'s Discuss')
    ], validators=[DataRequired()])
    description = TextAreaField('Project Description', validators=[
        DataRequired(),
        Length(min=50, max=2000, message='Please provide a detailed description (50-2000 characters)')
    ])
    requirements = TextAreaField('Specific Requirements & Features', validators=[
        DataRequired(),
        Length(min=20, max=2000, message='Please list specific requirements (20-2000 characters)')
    ])
    submit = SubmitField('Submit Request')
