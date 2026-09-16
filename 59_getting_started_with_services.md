All the task logic managment we're going to pass from task.component to task.service

tasks.component.ts
```typescript
import { Component, Input } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { type NewTaskData } from './task/task.model';
import { TasksService } from './tasks.service';

@Component({
    ...
    imports: [TaskComponent, NewTaskComponent]
})
export class TasksComponent {
    @Input({ required: true }) userId!: string;
    @Input({ required: true }) name!: string;
    isAddingTask = false;

    // we need this to be a singleton; cada vez que declaramos una variable asi como lo hacemos aca
    // es independiente a los otros lugares en donde se use el service, sera replicado cada vez que 
    // lo instanciamos de esta manera en los demas componentes a ser utilizado. Esto es en el caso
    // de que declaramos new taskService sin constructor
    // private tasksService = new TasksService();

    // en cambio si la misma variable pero lo inicializamos en el constructor es correcto
    private tasksService: TasksService;

    // para poder solucionar esto, debemos usar dependency injection, donde le dejamos a angular que
    // se encargue del a creacion del servicio task que vamos a utilizar
    constructor(tasksService: TasksService) {
        this.tasksService = tasksService;
    }

    // tambien existe una forma super corta que tambien es correcta que usando el constructor y la
    // declaracion de la variable dentro de la llamada del constructor. Es solo un shortcut pattern
    // a la opcion de arriba que nos brinda typescript
    constructor(private tasksService: TasksService) {}


    get selectedUserTasks() {
        return this.tasksService.getUserTasks(this.userId);
    }

    onCompleteTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    onStartAddTask() {
        this.isAddingTask = true;
    }

    onCancelAddTask() {
        this.isAddingTask = false;
    }

    onAddTask(taskData: NewTaskData) {
        this.tasksService.addTask(taskData, this.userId);
        this.isAddingTask = false;
    }
}
```

task.service.ts
```typescript
import { type NewTaskData } from './task/task.model';

// Necesitamos especificar el service como injectable para poder usar en el constructor.
// En otras secciones profundizaremos en providedIn y otros conceptos. Solo asi, nos aseguramos
// que angular creara este service solo una vez.
@Injectable({ providedIn: 'root' })
export class TasksService {
    // cortamos y pegamos el array de tasks y lo hacemos private
    private tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary: 'Learn all the basic and advance feature of Angular and how to apply them.',
            dueDate: '2025-12-31'
        },
        // ...
    ];

    // traemos tambien de la funcion selectedUserTask que estaba en tasks.component.ts
    getUserTask(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    addTask(taskData: NewTaskData, userId: string) {
        this.tasks.unshift({
            id: new Date().getTime().toString(),
            userId: userId,
            title: taskData.title,
            summary: taskData.summary,
            date: taskData.date
        });
    }

    removeTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }
}
```