import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { AppComponent } from './app.component';
import { AppDemoComponent } from '../app-demo/app-demo.component';

@NgModule({
  declarations: [AppComponent, AppDemoComponent],
  imports: [BrowserModule, ContextMenuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
