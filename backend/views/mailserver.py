from flask_mail import Mail, Message

mail = Mail()

def email(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'zacthuku7@gmail.com'
    app.config['MAIL_PASSWORD'] = 'tekp wehh wjyw dada'
    app.config['MAIL_DEFAULT_SENDER'] = 'zacthuku7@gmail.com'
    
    mail.init_app(app)

def send_email(name, email):
    subject = "Welcome to The Beauty"
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #fff0f5; color: #3a0c1a; padding: 20px; line-height: 1.6;">
            <h2 style="color: #d6336c; margin-bottom: 25px;">Hello {name}, Welcome to The Beauty!</h2>
            
            <p style="margin-bottom: 20px; font-size: 16px;">
                Thank you for joining <strong>The Beauty</strong> — your one-stop shop for quality products that bring out your natural shine.
            </p>
            
            <p style="margin-bottom: 15px; font-size: 16px;">With us, you can:</p>
            
            <ul style="margin-bottom: 25px; padding-left: 20px;">
                <li style="margin-bottom: 10px; font-size: 16px;">Shop handpicked skincare, makeup, and haircare collections</li>
                <li style="margin-bottom: 10px; font-size: 16px;">Enjoy exclusive offers and Free shipping on orders above kes 1500</li>
                <li style="margin-bottom: 10px; font-size: 16px;">Shop happily with a beautiful and secure experience</li>
            </ul>
            
            <p style="margin-bottom: 25px; font-size: 16px;">Ready to look Stunning?</p>
            
            <div style="margin: 30px 0;">
                <a href="https://thebeauty.vercel.app" 
                   style="background-color: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                   Start Shopping
                </a>
            </div>
            
            <p style="margin-top: 40px; font-size: 16px;">
                With love,<br/>
                <strong>The Beauty Team </strong>
            </p>
        </body>
    </html>
    """
    
    text_body = f"""
    Hello {name},
    
    Welcome to The Beauty — your one-stop shop for stunning products!
    
    Here's what you can expect:
    - Explore handpicked skincare, makeup, and haircare
    - Get exclusive offers
    - Enjoy a smooth shopping experience
    
    Start shopping now: https://thebeauty.vercel.app
    
    With love,
    The Beauty Team 💖
    """
    
    msg = Message(
        subject=subject,
        recipients=[email],
        html=html_body,
        body=text_body
    )
    
    mail.send(msg)

def send_reset_email(email, reset_url):
    subject = "Reset Your Password - The Beauty"
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #fff0f5; color: #3a0c1a; padding: 20px; line-height: 1.6;">
            <h2 style="color: #d6336c; margin-bottom: 25px;">Reset Your Password</h2>
            
            <p style="margin-bottom: 20px; font-size: 16px;">Hi there 👋,</p>
            
            <p style="margin-bottom: 20px; font-size: 16px;">
                We received a request to reset the password for your account associated with <strong>{email}</strong>.
            </p>
            
            <p style="margin-bottom: 25px; font-size: 16px;">Click the button below to reset it:</p>
            
            <div style="margin: 30px 0;">
                <a href="{reset_url}" 
                   style="background-color: #be123c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                   Reset Password
                </a>
            </div>
            
            <p style="margin: 25px 0; font-size: 16px; color: #666;">
                This link will expire in 1 hour.
            </p>
            
            <p style="margin-bottom: 30px; font-size: 16px;">
                If you didn't request a reset, you can safely ignore this email.
            </p>
            
            <p style="margin-top: 40px; font-size: 16px;">
                With care,<br/>
                <strong>The Beauty Team </strong>
            </p>
        </body>
    </html>
    """
    
    text_body = f"""
    Hello,
    
    You requested a password reset for your The Beauty account ({email}).
    
    Click the link below to reset it:
    {reset_url}
    
    This link will expire in 1 hour.
    
    If you didn't request this reset, you can ignore this email.
    
    With care,
    The Beauty Team 
    """
    
    msg = Message(
        subject=subject,
        recipients=[email],
        html=html_body,
        body=text_body
    )
    
    mail.send(msg)