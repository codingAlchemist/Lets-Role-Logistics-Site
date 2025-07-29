import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface QuoteDialogData {
  title?: string;
}

@Component({
  selector: 'app-quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.scss'],
})
export class QuoteDialogComponent {
  quoteForm: FormGroup;
  serviceTypes = [
    { value: 'standard', label: 'Standard Freight' },
    { value: 'expedited', label: 'Expedited Shipping' },
    { value: 'hazmat', label: 'Hazmat Transportation' },
    { value: 'ltl', label: 'Less Than Truckload (LTL)' },
    { value: 'ftl', label: 'Full Truckload (FTL)' },
    { value: 'refrigerated', label: 'Refrigerated Transport' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuoteDialogData
  ) {
    this.quoteForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      serviceType: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1)]],
      dimensions: [''],
      description: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
    });
  }

  onSubmitQuote() {
    if (this.quoteForm.valid) {
      const formData = this.quoteForm.value;
      console.log('Quote submitted:', formData);

      // Here you would typically send the data to a service
      // For now, we'll just close the dialog with the form data
      this.dialogRef.close(formData);
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.quoteForm.controls).forEach((key) => {
        this.quoteForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onReset() {
    this.quoteForm.reset();
  }
}
