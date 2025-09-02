import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./sidebar/app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { AppTopBarComponent } from './topbar/app.topbar.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { MenuModule } from 'primeng/menu';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        MenuModule,
        SharedModule,
        PasswordModule,
        ButtonModule,
        OverlayPanelModule        
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
