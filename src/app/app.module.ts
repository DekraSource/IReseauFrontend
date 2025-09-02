import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { CalendarModule } from 'primeng/calendar';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { SharedModule } from './shared/shared.module';
import { MessageService } from 'primeng/api';
import { httpInterceptorProviders } from './demo/service/guard/http.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalErrorHandlerService } from './demo/service/general/global-error.service';
import { ToastModule } from 'primeng/toast';
import { DragDropModule } from '@angular/cdk/drag-drop';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [   BrowserModule, ToastModule,
        BrowserAnimationsModule, AppRoutingModule, AppLayoutModule, SharedModule, CalendarModule,DragDropModule],
    exports:[SharedModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService,
        httpInterceptorProviders,
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
