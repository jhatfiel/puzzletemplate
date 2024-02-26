import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NavService } from './nav.service';
import { MainComponent } from './main.component';
import { NavComponent } from './nav/nav.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { GenericPuzzleComponent } from './visualization/GenericPuzzle.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';
import { PhaserComponent } from './visualization/Phaser.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { a0001Component } from './visualization/0001/a0001';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    GenericPuzzleComponent,
    PhaserComponent,
    a0001Component
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
    SelectButtonModule,
    ToolbarModule,
    CheckboxModule,
    DividerModule,
    AngularResizeEventModule,
    SliderModule,
  ],
  providers: [NavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
