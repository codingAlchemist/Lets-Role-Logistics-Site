import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData
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
      const formData = this.contactForm.value;
      console.log('Contact form submitted:', formData);

      // Here you would typically send the data to a service
      // For now, we'll just close the dialog with the form data
      this.dialogRef.close(formData);
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
