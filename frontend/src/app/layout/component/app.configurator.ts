import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { $t } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-configurator',
    standalone: true,
    template: ``
})
export class AppConfigurator implements OnInit {
    private layoutService = inject(LayoutService);
    private platformId = inject(PLATFORM_ID);

    ngOnInit() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            preset: 'Aura',
            primary: 'indigo',
            surface: null,
            menuMode: 'static'
        }));

        if (isPlatformBrowser(this.platformId)) {
            $t()
                .preset(Aura)
                .preset(this.getAuraIndigoPreset())
                .use({ useDefaultOptions: true });
        }
    }

    private getAuraIndigoPreset() {
        const indigoPalette = (Aura as any).primitive.indigo;

        return {
            semantic: {
                primary: indigoPalette,
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.500}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.600}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.100}',
                            color: '{primary.700}',
                            focusColor: '{primary.800}'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.400}',
                            contrastColor: '{surface.900}',
                            hoverColor: '{primary.300}',
                            activeColor: '{primary.200}'
                        },
                        highlight: {
                            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                            color: 'rgba(255,255,255,.87)',
                            focusColor: 'rgba(255,255,255,.87)'
                        }
                    }
                }
            }
        };
    }
}
