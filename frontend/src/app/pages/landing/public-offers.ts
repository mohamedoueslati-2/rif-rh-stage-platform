import { Component } from '@angular/core';
import { TopbarWidget } from './components/topbarwidget.component';
import { OffersWidget } from './components/offerswidget';
import { FooterWidget } from './components/footerwidget';

@Component({
    selector: 'app-public-offers',
    standalone: true,
    imports: [TopbarWidget, OffersWidget, FooterWidget],
    template: `
        <div class="min-h-screen bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <offers-widget />
            <footer-widget />
        </div>
    `
})
export class PublicOffers {}
