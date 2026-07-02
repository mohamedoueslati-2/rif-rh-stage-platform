import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';
import { FooterWidget } from './components/footerwidget';
import { AuthService } from '../auth/services/auth.service';
import { OffersWidget } from './components/offerswidget';
import { ContactCtaWidget } from './components/contact-cta-widget';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, OffersWidget, FeaturesWidget, ContactCtaWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <hero-widget />
                <offers-widget />
                <features-widget />
                <contact-cta-widget />
                <footer-widget />
            </div>
        </div>
    `
})
export class Landing implements OnInit {
    private readonly authService = inject(AuthService);

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) void this.authService.redirectByRole();
    }
}
