import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  inquiryType: string;
  subject: string;
  message: string;
  preferredContact: string;
  urgency: string;
  newsletter: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly RECIPIENT_EMAIL = 'jason@j-bcreations.com';

  constructor(private http: HttpClient) {}

  sendContactEmail(formData: ContactFormData): Observable<any> {
    const emailData: EmailData = {
      to: this.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: this.generateEmailHTML(formData),
      from: 'noreply@letsrolllogistics.com',
    };

    // For development, we'll simulate sending the email
    // In production, you would integrate with a real email service
    return this.simulateEmailSend(emailData);
  }

  private generateEmailHTML(formData: ContactFormData): string {
    const urgencyColors = {
      low: '#28a745',
      normal: '#17a2b8',
      high: '#ffc107',
      critical: '#dc3545',
    };

    const urgencyColor =
      urgencyColors[formData.urgency as keyof typeof urgencyColors] ||
      '#17a2b8';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #0d47a1; display: inline-block; width: 150px; }
          .value { color: #333; }
          .urgency { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
          .message-box { background: white; padding: 15px; border-left: 4px solid #1976d2; margin-top: 10px; border-radius: 4px; }
          .footer { margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 4px; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚚 Let's Roll Logistics</h1>
          <h2>New Contact Form Submission</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <span class="value">${formData.firstName} ${
      formData.lastName
    }</span>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:${formData.email}">${
      formData.email
    }</a></span>
          </div>
          
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value"><a href="tel:${formData.phone}">${
      formData.phone
    }</a></span>
          </div>
          
          ${
            formData.company
              ? `
          <div class="field">
            <span class="label">Company:</span>
            <span class="value">${formData.company}</span>
          </div>
          `
              : ''
          }
          
          <div class="field">
            <span class="label">Inquiry Type:</span>
            <span class="value">${this.getInquiryTypeLabel(
              formData.inquiryType
            )}</span>
          </div>
          
          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${formData.subject}</span>
          </div>
          
          <div class="field">
            <span class="label">Preferred Contact:</span>
            <span class="value">${
              formData.preferredContact === 'email' ? 'Email' : 'Phone'
            }</span>
          </div>
          
          <div class="field">
            <span class="label">Urgency:</span>
            <span class="urgency" style="background-color: ${urgencyColor};">
              ${formData.urgency.toUpperCase()}
            </span>
          </div>
          
          <div class="field">
            <span class="label">Newsletter:</span>
            <span class="value">${
              formData.newsletter ? 'Yes, subscribed' : 'No'
            }</span>
          </div>
          
          <div class="field">
            <span class="label">Message:</span>
            <div class="message-box">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Submission Details:</strong></p>
          <p>Received: ${new Date().toLocaleString()}</p>
          <p>IP: [Auto-detected by server]</p>
          <p>Source: Let's Roll Logistics Website Contact Form</p>
        </div>
      </body>
      </html>
    `;
  }

  private getInquiryTypeLabel(value: string): string {
    const inquiryTypes: { [key: string]: string } = {
      general: 'General Inquiry',
      quote: 'Request Quote',
      tracking: 'Shipment Tracking',
      support: 'Technical Support',
      partnership: 'Partnership Opportunities',
      careers: 'Career Opportunities',
      billing: 'Billing Questions',
      feedback: 'Feedback/Complaints',
    };
    return inquiryTypes[value] || value;
  }

  private simulateEmailSend(emailData: EmailData): Observable<any> {
    // Simulate email sending with a delay
    return new Observable((observer) => {
      console.log('📧 Email would be sent to:', emailData.to);
      console.log('📧 Subject:', emailData.subject);
      console.log('📧 HTML Content:', emailData.html);

      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Email sent successfully',
          recipient: emailData.to,
          timestamp: new Date().toISOString(),
        });
        observer.complete();
      }, 1000);
    });
  }

  // Method to integrate with real email service (e.g., EmailJS, SendGrid, etc.)
  sendEmailViaService(emailData: EmailData): Observable<any> {
    // Example integration with EmailJS
    // You would need to install emailjs-com: npm install emailjs-com
    // import emailjs from 'emailjs-com';

    // return emailjs.send(
    //   'your_service_id',
    //   'your_template_id',
    //   {
    //     to_email: emailData.to,
    //     subject: emailData.subject,
    //     html_content: emailData.html
    //   },
    //   'your_user_id'
    // );

    // For now, return the simulation
    return this.simulateEmailSend(emailData);
  }
}
