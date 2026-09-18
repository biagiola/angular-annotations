import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from './shared/shared.module';
import { TasksModule } from './tasks/tasks.module';

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        HeaderComponent,   
    ],
    bootstrap: [AppComponent], // marcamos cual es el root component
    imports: [BrowserModule, SharedModule, TasksModule] // para mantener estos componentes como standalone agregamos esta linea y no en el array de declarations
})
export class AppModule {

}

// side note: sabemos que imports es para los standalone y declarations para los non-standalone,
// ahora bien, ya estuvimos haciendo esto sin saberlo en el componente new-task.component.ts
// en su import para el FormModule
// ```typescript
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-new-task',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './new-task.component.html',
//   styleUrl: './new-task.component.css',
// })
// export class NewTaskComponent {
// ```

// side note 2: we dont need to put dateTime in the imports[] coz it's automatically imported in the BrowserModule

// side note 3: podemos tener Modules dentro de otros modules, que herarquizar componentes de esta menera, es lo que hicimos con
// el componente de Cards y User. Es bastante comun poner los shared componentes en su propio Module.