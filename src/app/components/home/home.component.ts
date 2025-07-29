import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  menuItems = [
    { name: 'Home', route: '/home', icon: 'home' },
    { name: 'Services', route: '/services', icon: 'local_shipping' },
    { name: 'Careers', route: '/careers', icon: 'work' },
    { name: 'Quote', route: '/quote', icon: 'request_quote' },
    { name: 'About', route: '/about', icon: 'info' },
    { name: 'Contact', route: '/contact', icon: 'contact_mail' },
  ];

  constructor(private router: Router, private dialog: MatDialog) {}

  onMenuItemClick(item: any) {
    console.log('Menu item clicked:', item.name);

    // Handle dialog-based menu items
    if (item.name === 'Quote') {
      this.openQuoteDialog();
      return;
    }

    if (item.name === 'Contact') {
      this.openContactDialog();
      return;
    }

    // Navigate to other routes
    this.router.navigate([item.route]).catch((err) => {
      console.log('Navigation error:', err);
      // For now, just log routes that don't exist yet
    });
  }

  openQuoteDialog() {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        title: 'Get a Quick Quote',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Quote submitted:', result);
        // Here you would typically send the data to a service
        alert('Quote request submitted! We will contact you within 24 hours.');
      }
    });
  }

  openContactDialog() {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        title: 'Contact Us',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Contact form submitted:', result);
        // Here you would typically send the data to a service
        const urgencyText =
          result.urgency === 'critical'
            ? 'immediately'
            : result.urgency === 'high'
            ? 'within 2-4 hours'
            : result.urgency === 'normal'
            ? 'within 24 hours'
            : 'within 48 hours';
        alert(`Thank you for contacting us! We will respond ${urgencyText}.`);
      }
    });
  }

  // Method to open contact dialog from buttons/cards
  onContactUs() {
    this.openContactDialog();
  }

  // Method to open quote dialog from buttons/cards
  onGetQuote() {
    this.openQuoteDialog();
  }
}
