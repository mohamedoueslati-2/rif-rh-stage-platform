import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-floating-configurator',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <div class="flex gap-4 top-8 right-8" [ngClass]="{ fixed: float() }">
            <p-button
                type="button"
                (onClick)="toggleDarkMode()"
                [rounded]="true"
                [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
                severity="secondary"
            />
        </div>
    `
})
export class AppFloatingConfigurator {
    layoutService = inject(LayoutService);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
