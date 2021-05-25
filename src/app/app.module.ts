import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HorlogeComponent} from './horloge/horloge.component';
import {PowerComponent} from './power/power.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {ChartsModule} from 'ng2-charts';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {AppConfig} from './app.config';
import {HorlogeGraphComponent} from './horlogeGraph/horlogeGraph.component';

// tslint:disable-next-line:typedef
export function initializeApp(appConfig: AppConfig) {
	return () => appConfig.load();
}

@NgModule({
	declarations: [
		AppComponent,
		HorlogeComponent,
		HorlogeGraphComponent,
		PowerComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatTabsModule,
		MatSidenavModule,
		ChartsModule,
		HttpClientModule,
		HttpClientJsonpModule
	],
	providers: [
		AppConfig,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [AppConfig], multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
