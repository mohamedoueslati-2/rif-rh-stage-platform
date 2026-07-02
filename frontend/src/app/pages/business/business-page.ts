import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-business-page',
    standalone: true,
    template: `
        <div class="card">
            <h1 class="m-0 text-2xl font-semibold">{{ title }}</h1>
        </div>
    `
})
export class BusinessPage {
    private readonly route = inject(ActivatedRoute);
    readonly title = this.route.snapshot.data['title'] as string;
}
