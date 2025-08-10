import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailService, ContactFormData } from '../../services/email.service';

export interface ContactDialogData {
  title?: string;
}

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
})
export class ContactDialogComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'tracking', label: 'Shipment Tracking' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'careers', label: 'Career Opportunities' },
    { value: 'billing', label: 'Billing Questions' },
    { value: 'feedback', label: 'Feedback/Complaints' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData,
    private emailService: EmailService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: [''],
      inquiryType: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      preferredContact: ['email', Validators.required],
      urgency: ['normal', Validators.required],
      newsletter: [false],
    });
  }

  onSubmitContact() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const formData: ContactFormData = this.contactForm.value;
      console.log('Contact form submitted:', formData);

      // Send email using the email service
      this.emailService.sendContactEmail(formData).subscribe({
        next: (response) => {
          console.log('Email sent successfully:', response);
          this.isSubmitting = false;

          // Close dialog with success data
          this.dialogRef.close({
            ...formData,
            emailSent: true,
            emailResponse: response,
          });
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.isSubmitting = false;

          // Close dialog with error data
          this.dialogRef.close({
            ...formData,
            emailSent: false,
            error: error,
          });
        },
      });
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onReset() {
    this.contactForm.reset({
      preferredContact: 'email',
      urgency: 'normal',
      newsletter: false,
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.hasError(errorType) && field.touched : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Message must be at least ${minLength} characters long`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      inquiryType: 'Inquiry Type',
      subject: 'Subject',
      message: 'Message',
      preferredContact: 'Preferred Contact Method',
      urgency: 'Urgency',
    };
    return labels[fieldName] || fieldName;
  }
}
