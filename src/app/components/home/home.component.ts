import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
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
    {
      name: 'Careers',
      route: '/careers',
      icon: 'work',
      submenu: [
        {
          name: 'Join Our Team',
          route: '/careers/join-our-team',
          icon: 'person_add',
        },
        {
          name: 'Elite Driver Team',
          route: '/careers/elite-driver-team',
          icon: 'local_shipping',
        },
      ],
    },
    { name: 'Quote', route: '/quote', icon: 'request_quote' },
    {
      name: 'About',
      route: '/about',
      icon: 'info',
      submenu: [
        { name: 'About Lets Roll', route: '/about/lets-roll', icon: 'history' },
        { name: 'Safety', route: '/about/safety', icon: 'shield' },
        { name: 'Leadership', route: '/about/leadership', icon: 'leaderboard' },
      ],
    },
    { name: 'Contact', route: '/contact', icon: 'contact_mail' },
  ];

  isMobileMenuOpen = false;
  openSubmenu: string | null = null;
  hoveredMenuItem: string | null = null;
  currentOpenTrigger: MatMenuTrigger | null = null;

  constructor(private router: Router, private dialog: MatDialog) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.openSubmenu = null;
  }

  toggleSubmenu(menuName: string) {
    this.openSubmenu = this.openSubmenu === menuName ? null : menuName;
    console.log('Toggled submenu:', this.openSubmenu);
  }

  showSubmenu(item: any) {
    if (item.submenu.length > 0) {
      this.openSubmenu = item.name;
    }
  }
  hideSubmenu() {
    this.openSubmenu = null;
  }

  hasSubmenu(item: any): boolean {
    return item.submenu && item.submenu.length > 0;
  }

  onMenuItemHover(item: any, trigger: MatMenuTrigger | null) {
    if (this.hasSubmenu(item) && trigger) {
      // Close any previously open submenu if hovering over a different item with submenu
      if (this.currentOpenTrigger && this.currentOpenTrigger !== trigger) {
        this.currentOpenTrigger.closeMenu();
      }

      // Open the new submenu
      this.hoveredMenuItem = item.name;
      this.currentOpenTrigger = trigger;
      if (!trigger.menuOpen) {
        trigger.openMenu();
      }
    } else if (!this.hasSubmenu(item)) {
      // If hovering over a menu item without submenu, close any open submenu
      if (this.currentOpenTrigger) {
        this.currentOpenTrigger.closeMenu();
        this.currentOpenTrigger = null;
      }
      this.hoveredMenuItem = null;
    }
  }

  onMenuItemLeave(trigger: MatMenuTrigger) {
    // Don't close the submenu when leaving the menu item
    // It will only close when hovering over another menu item or leaving the menu area entirely
  }

  onSubmenuHover(trigger: MatMenuTrigger) {
    // Keep the submenu open when hovering over it
    this.currentOpenTrigger = trigger;
  }

  onSubmenuLeave(trigger: MatMenuTrigger) {
    // Close the submenu when the user leaves the submenu area
    if (this.currentOpenTrigger === trigger && trigger.menuOpen) {
      trigger.closeMenu();
      this.currentOpenTrigger = null;
      this.hoveredMenuItem = null;
    }
  }

  onMenuAreaLeave() {
    // Close any open submenu when leaving the entire menu area
    if (this.currentOpenTrigger && this.currentOpenTrigger.menuOpen) {
      this.currentOpenTrigger.closeMenu();
      this.currentOpenTrigger = null;
    }
    this.hoveredMenuItem = null;
  }

  shouldShowSubmenu(item: any): boolean {
    return this.hasSubmenu(item) && this.hoveredMenuItem === item.name;
  }

  onMenuItemClick(item: any, isMobileClick: boolean = false) {
    console.log('Menu item clicked:', item.name);

    // If item has submenu and this is a mobile click, toggle it instead of navigating
    if (this.hasSubmenu(item) && (isMobileClick || this.isMobileMenuOpen)) {
      this.toggleSubmenu(item.name);
      return;
    }

    // Close mobile menu when an item is clicked
    this.closeMobileMenu();

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

        if (result.emailSent) {
          const urgencyText =
            result.urgency === 'critical'
              ? 'immediately'
              : result.urgency === 'high'
              ? 'within 2-4 hours'
              : result.urgency === 'normal'
              ? 'within 24 hours'
              : 'within 48 hours';

          alert(
            `✅ Thank you for contacting us! Your message has been sent to jason@j-bcreations.com and we will respond ${urgencyText}.`
          );
        } else {
          console.error('Email sending failed:', result.error);
          alert(
            `❌ There was an issue sending your message. Please try again or contact us directly at jason@j-bcreations.com`
          );
        }
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
