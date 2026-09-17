Ahora utilizaremos de nuevo, elementos de nuestro nuevo service pero esta vez en new-task component.

This lesson shows why services are so powerful: once a service is a singleton, any component can inject it directly and talk to the same shared data — you're no longer forced to relay everything up through @Output events to a common ancestor.

The core concept: NewTaskComponent no longer needs to "ask permission"

Before, NewTaskComponent emitted the form data via @Output() add, and TasksComponent was the one that actually called tasksService.addTask(...). Now, NewTaskComponent injects TasksService itself and calls addTask(...) directly:

```typescript
// new-task.component.ts
onSubmit() {
    this.tasksService.addTask({ title: ..., summary: ..., date: ... }, this.userId);
    this.close.emit();
}
```

This is only safe/correct because of the singleton guarantee from providedIn: 'root' — whichever instance NewTaskComponent injects is the exact same instance TasksComponent is using, so the shared tasks array updates correctly no matter which component touched it. This is the real payoff of DI: components that aren't directly related in the parent/child chain can still share state cleanly.

Since NewTaskComponent no longer needs to hand data back up, @Output() add becomes pointless — only close remains, just to tell the parent "I'm done, please unmount me."

Two equivalent ways to inject a service

The lesson shows both, side by side:

Constructor injection (what you've used so far):
```typescript
constructor(private tasksService: TasksService) {}
```

The inject() function (a newer, alternative style):
```typescript
private tasksService = inject(TasksService);
```

Both achieve the exact same result — Angular hands you the singleton instance. inject() is a function-based approach that can be used as a class field initializer (as shown) or even inside other injectable functions/contexts outside a constructor, which constructor injection can't do. It's increasingly the more idiomatic style in modern Angular, especially since it doesn't require a constructor at all.

Important: you use one or the other, never both for the same dependency — that's a bug in this snippet, addressed below.

userId now flows down as a plain @Input

Since NewTaskComponent calls tasksService.addTask(data, this.userId) itself, it needs userId to be available locally — so it's now a required @Input, passed from the parent template:

```html
<app-new-task [userId]="userId" (close)="onCloseAddTask()" />
```

Nothing new mechanically here, just reinforcing the @Input pattern from earlier lessons, now combined with service injection.

new-task.ts
```typescript
import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type NewTaskData } from '../task/task.model';
import { TasksService } from '../tasks.service';

@Component({
    selector: 'app-new-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './new-task.component.html',
    styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
    // agregamos variable para manejar el userId
    @Input({ required: true }) userId!: string;

    // en vez de cancel ahora lo llamamos close
    @Output() close = new EventEmitter<void>();

    // como estamos usando el taskService, ya no estamos emitiendo este evento
    @Output() add = new EventEmitter<NewTaskData>();

	enteredTitle = '';
	enteredSummary = '';
	enteredDate = '';
    
    // podemos usar el constructor como en el ejemplo 59
    constructor(private tasksService: TasksService) {}

    // o tambien podemos usar el inject() y le pasamos nuestro injection token que seria TaskService
    private tasksService = inject(TasksService);

    // obviamente, tenemos que elegir si usar el constructor o inject, pero no ambos al mismo tiempo 

    onCancel() {
        this.close.emit();
    }

    onSubmit() {
        // entonces ahora usamos el service
        this.tasksService.addTask({
            title: this.enteredTitle,
            summary: this.enteredSummary,
            date: this.enteredDate
        }, this.userId);

        // cerramos el dialog luego de enviar el formulario
        this.close.emit();
    }
}
```

ahora tenemos que asegurarnos que el userId es proveido a nuestro new-task component por el component padre que seria tasks template
tasks.component.ts
```typescript
export class TasksComponent {
    @Input({ required: true }) userId!: string; // <- esta variable existe y debemos asegurarnos de pasarle al hijo
    @Input({ required: true }) name!: string;
    isAddingTask = false;

    constructor(private tasksService: TasksService) {}

    get selectedUserTasks() {
        return this.tasksService.getUserTasks(this.userId);
    }

    onCompleteTask(id: string) {
        this.tasksService.removeTask(id);
    }

    onStartAddTask() {
        this.isAddingTask = true;
    }

    onCloseAddTask() {
        this.isAddingTask = false;
    }
    
    // ya no lo usamos
    // onAddTask(taskData: NewTaskData) {
    //     this.isAddingTask = false;
    // }
```

tasks.html
```html
@if (isAddingTask) {
    <!-- Tasks es el padre de New-Task -->
    <app-new-task [userId]="userId" (close)="onCloseAddTask()" />
}
<section id="taks">
    <header>
        <h2>{{ name }}'s Tasks</h2>
    </header>
    <menu>
        <button (click)="onStartAddTask()">Add Task</button>
    </menu>
    <ul>
        @for (task of selectedUserTasks; track task.id) {
            <li>
                <app-task
                    [task]="task"
                    (complete)="onCompleteTask($event)"
                />
            </li>
        }
    </ul>
</section>
```

Key takeaway: once you have a singleton service, any component in the tree can inject it and read/write the same shared state directly — you don't have to keep threading data through @Input/@Output chains just to reach a common ancestor. inject() is a more modern, flexible alternative to constructor injection for grabbing that service reference.