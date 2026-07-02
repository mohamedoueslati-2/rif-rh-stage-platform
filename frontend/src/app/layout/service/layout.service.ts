import { Injectable, effect, signal, computed } from '@angular/core';

export interface LayoutConfig {
    preset: string;
    primary: string;
    surface: string | undefined | null;
    darkTheme: boolean;
    menuMode: string;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    configSidebarVisible: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    layoutConfig = signal<LayoutConfig>({
        preset: 'Aura',
        primary: 'indigo',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    });

    layoutState = signal<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        mobileMenuActive: false,
        menuHoverActive: false,
        activePath: null
    });

    theme = computed(() => (this.layoutConfig().darkTheme ? 'dark' : 'light'));

    isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().mobileMenuActive);

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    getPrimary = computed(() => 'indigo');

    getSurface = computed(() => this.layoutConfig().surface);

    isOverlay = computed(() => false);

    transitionComplete = signal<boolean>(false);

    private initialized = false;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized) {
                this.initialized = true;
                this.toggleDarkMode(config);
                return;
            }

            this.handleDarkModeTransition(config);
        });
    }

    private handleDarkModeTransition(config: LayoutConfig): void {
        if (typeof document === 'undefined') {
            return;
        }

        const documentWithTransition = document as Document & {
            startViewTransition?: (callback: () => void) => void;
        };

        if (documentWithTransition.startViewTransition) {
            documentWithTransition.startViewTransition(() => {
                this.toggleDarkMode(config);
            });
        } else {
            this.toggleDarkMode(config);
        }
    }

    toggleDarkMode(config?: LayoutConfig): void {
        if (typeof document === 'undefined') {
            return;
        }

        const currentConfig = config || this.layoutConfig();

        if (currentConfig.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    onMenuToggle(): void {
        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !prev.staticMenuDesktopInactive,
                overlayMenuActive: false
            }));
        } else {
            this.layoutState.update((prev) => ({
                ...prev,
                mobileMenuActive: !prev.mobileMenuActive,
                overlayMenuActive: false
            }));
        }
    }

    showConfigSidebar(): void {
        this.layoutState.update((prev) => ({
            ...prev,
            configSidebarVisible: false
        }));
    }

    hideConfigSidebar(): void {
        this.layoutState.update((prev) => ({
            ...prev,
            configSidebarVisible: false
        }));
    }

    isDesktop(): boolean {
        return typeof window !== 'undefined' && window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }
}
