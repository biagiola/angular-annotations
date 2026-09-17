All the task logic managment we're going to pass from task.component to task.service

This is a big conceptual jump — services and dependency injection (DI), Angular's way of separating data/business logic from components, whose job should really just be handling the UI.

The core concept: why move logic out of the component?

Before this lesson, TasksComponent owned the tasks array directly and had all the filter/add/remove logic inline. The problem: if another component elsewhere in the app also needed access to tasks (not just this one nested under a selected user), you'd either have to duplicate that array and logic, or awkwardly pass it down through many layers of @Input/@Output. A service solves this by holding shared data/logic in one place that any component can request access to.

The three ways to get a service instance (and why only one is correct)

The commented-out code walks through this progression, which is worth understanding step by step:

1 . private tasksService = new TasksService(); — ❌ Wrong. Every component that does this creates its own separate instance of TasksService, each with its own independent copy of the tasks array. Changes in one component's instance wouldn't be visible in another's — defeating the whole purpose of centralizing data.
2 . Manual constructor assignment:
```typescript
   private tasksService: TasksService;
   constructor(tasksService: TasksService) {
       this.tasksService = tasksService;
   }
```

This is correct in principle — but only works if something outside the class provides that tasksService argument. That "something" is Angular's dependency injection system.

The shortcut (what you'll actually write):
```typescript
   constructor(private tasksService: TasksService) {}
```

This is TypeScript parameter property syntax — declaring private directly on a constructor parameter automatically creates the class field and assigns it, in one line. Functionally identical to #2, just less code.

What makes DI work: @Injectable({ providedIn: 'root' })
```typescript
@Injectable({ providedIn: 'root' })
export class TasksService { ... }
```

This decorator tells Angular "this class can be injected into constructors," and providedIn: 'root' tells Angular to create exactly one instance of this service for the entire app (a singleton) and hand that same instance to every component that asks for it via constructor injection. This is what guarantees all components share the same tasks array.

The logic that moved
1 . The tasks array itself is now private inside TasksService, not the component.
2 . selectedUserTasks (a getter in the component) is replaced by calling this.tasksService.getUserTasks(this.userId).
3 . onAddTask no longer mutates a local array — it delegates to this.tasksService.addTask(...).
4 . A new removeTask(id) method now lives in the service, ready to replace the old inline filter logic for completing/removing tasks.

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
        // before
        // this.tasks = this.tasks.filter((task) => task.id !== id);

        // now
        this.tasksService.removeTask(id);
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
import { Injectable } from '@angular/core';
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
    getUserTasks(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    addTask(taskData: NewTaskData, userId: string) {
        this.tasks.unshift({
            id: new Date().getTime().toString(),
            userId: userId,
            title: taskData.title,
            summary: taskData.summary,
            dueDate: taskData.date
        });
    }

    removeTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }
}
```

Key takeaway: services + @Injectable({ providedIn: 'root' }) give you a singleton that holds shared state/logic outside any one component, and constructor injection (constructor(private myService: MyService) {}) is how Angular hands that same instance to every component that needs it — this is the foundation for keeping components "dumb" (UI-focused) while services handle data and business rules.