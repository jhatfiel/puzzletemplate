import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { GenericPuzzleComponent } from './visualization/GenericPuzzle.component';
import { a0001Component } from './visualization/0001/a0001';

const routes: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full'},
    // { path: '2018/20/a', component: a201820Component },
    { path: '0001/a', component: a0001Component },
    { path: '**', component: GenericPuzzleComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}