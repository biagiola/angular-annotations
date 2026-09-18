import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TasksComponent } from "./tasks.component";
import { TaskComponent } from "./task/task.component";
import { NewTaskComponent } from "./new-task/new-task.component";
import { SharedModule } from "../shared/shared.module";


@NgModule({
    // estos son los componentes que trabajan entre ellos internamente
    declarations: [
        TasksComponent,
        TaskComponent,
        NewTaskComponent
    ],
    // este es el component que es usado por otros afuera (app component no asi user, o header component)
    exports: [TasksComponent],
    imports: [CommonModule, FormsModule, SharedModule]
})
export class TasksModule {

}

// CommonModule es para solucionar lo del pipe Date, ya que BrowserModule en el import de app.module es solo para cuestiones del root

// FormsModule lo debemos importar por el tema del ngModel que es una en new-task.component