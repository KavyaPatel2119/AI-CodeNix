import os
import requests
import logging
from typing import Dict, Optional
import dotenv
# Load environment variables    
dotenv.load_dotenv()

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        self.base_url = "https://api.resend.com/emails"
        self.from_email = "onboarding@resend.dev"  # Resend's test domain
        self.support_email = "kavyapatel1952007@gmail.com"  # Your actual email
    
    def send_complex_request(self, user_data: Dict) -> Dict:
        """Send complex code request to support team"""
        try:
            # Create email content
            subject = f"Complex Code Request from {user_data['name']}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .header {{ background: #1a1a2e; color: #00f5ff; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .field {{ margin: 15px 0; }}
                    .field-label {{ font-weight: bold; color: #8a2be2; }}
                    .field-value {{ background: #f8f8f8; padding: 10px; border-left: 3px solid #00f5ff; }}
                    .footer {{ background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AI CodeNix - Complex Request</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="field-label">Name:</div>
                        <div class="field-value">{user_data['name']}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">{user_data['email']}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Phone:</div>
                        <div class="field-value">{user_data.get('phone', 'Not provided')}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Project Type:</div>
                        <div class="field-value">{user_data['project_type']}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Programming Languages:</div>
                        <div class="field-value">{', '.join(user_data['languages'])}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Timeline:</div>
                        <div class="field-value">{user_data['timeline']}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Budget Range:</div>
                        <div class="field-value">{user_data['budget']}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Project Description:</div>
                        <div class="field-value">{user_data['description'].replace(chr(10), '<br>')}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Specific Requirements:</div>
                        <div class="field-value">{user_data['requirements'].replace(chr(10), '<br>')}</div>
                    </div>
                </div>
                <div class="footer">
                    <p>Sent from AI CodeNix - Code the Future</p>
                    <p>Received on {user_data.get('timestamp', 'N/A')}</p>
                </div>
            </body>
            </html>
            """
            
            # Send email via Resend API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "from": self.from_email,
                "to": [self.support_email],
                "subject": subject,
                "html": html_content,
                "reply_to": user_data['email']
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            response.raise_for_status()
            
            logger.info(f"Complex request email sent successfully for {user_data['email']}")
            return {"success": True, "message": "Request sent successfully"}
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Email sending failed: {str(e)}")
            return {"success": False, "error": f"Failed to send email: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error sending email: {str(e)}")
            return {"success": False, "error": f"Unexpected error: {str(e)}"}
    
    def send_confirmation_email(self, user_email: str, user_name: str) -> Dict:
        """Send confirmation email to user"""
        try:
            subject = "Your Complex Code Request - AI CodeNix"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .header {{ background: #1a1a2e; color: #00f5ff; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .highlight {{ color: #8a2be2; font-weight: bold; }}
                    .footer {{ background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AI CodeNix</h1>
                    <p>Code the Future</p>
                </div>
                <div class="content">
                    <h2>Thank you for your complex code request!</h2>
                    <p>Hi {user_name},</p>
                    <p>We've received your request for a complex coding project. Our team will review your requirements and get back to you within <span class="highlight">24-48 hours</span>.</p>
                    
                    <h3>What happens next?</h3>
                    <ul>
                        <li>Our expert developers will analyze your requirements</li>
                        <li>We'll prepare a detailed proposal with timeline and pricing</li>
                        <li>You'll receive a personalized response at this email address</li>
                    </ul>
                    
                    <p>In the meantime, feel free to use our <span class="highlight">AI Code Generator</span> for simpler coding tasks.</p>
                    
                    <p>Best regards,<br>
                    The AI CodeNix Team</p>
                </div>
                <div class="footer">
                    <p>AI CodeNix - Transforming Ideas into Code with AI Precision</p>
                </div>
            </body>
            </html>
            """
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "from": self.from_email,
                "to": [user_email],
                "subject": subject,
                "html": html_content
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            response.raise_for_status()
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Confirmation email failed: {str(e)}")
            return {"success": False, "error": str(e)}

# Create service instance
email_service = EmailService()