Ahora utilizaremos de nuevo, elementos de nuestro nuevo service pero esta vez en new-task component.

This lesson mirrors the previous one exactly, just applied to removing tasks instead of adding them: TaskComponent now injects TasksService directly and calls removeTask itself, instead of emitting an event for TasksComponent to handle.

The core concept: same DI pattern, opposite direction

Previously, TaskComponent had @Output() complete = new EventEmitter<string>(), and clicking "Complete" emitted the task's id up to TasksComponent, which then called this.tasksService.removeTask(id).

Now TaskComponent cuts out the middleman:

```typescript
private tasksService = inject(TasksService);

onCompleteTask() {
    this.tasksService.removeTask(this.task.id);
}
```

Since TaskComponent already has this.task (passed in via @Input), it has everything it needs to call removeTask on its own — no need to bubble anything up through an @Output. This is the same insight as last lesson: once a component can inject the singleton service, it doesn't need to relay data through its parent just to trigger a shared-state change.

What disappears as a result
1 . @Output() complete is gone from TaskComponent — nothing external needs to know a task was completed anymore.
2 . (complete)="onCompleteTask($event)" is removed from tasks.html on <app-task> — there's no event to listen for.
3 . onCompleteTask(id: string) can be deleted entirely from TasksComponent — that responsibility has moved fully into TaskComponent + TasksService.

This is a nice illustration of how introducing a shared service can shrink a parent component over time — logic that used to have to live centrally (because only the parent could touch the array) can now be pushed down to wherever it's actually triggered.

new-task.ts
```typescript
import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type NewTaskData } from '../task/task.model';
import { TasksService } from '../tasks.service';

@Component({
    selector: 'app-new-task',
    standalone: true,
    imports: [FormsModule], // este import nos habilita el ngModel
    templateUrl: './new-task.component.html',
    styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
    // agregamos variable para manejar el userId
    @Input({ required: true }) userId!: string = '';

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
    private tasksService = inject(TaskService);

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

task.ts
```typescript
import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { type Task } from './task.model';
import { CardComponent } from '../../shared/card/card.component';
import { TasksService } from '../tasks.service';

@Component({
    selector: 'app-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrl: './task.component.css',
    imports: [CardComponent, DatePipe],
})
export class TaskComponent {
    @Input({ required: true }) task!: Task;

    // injectamos el task service
    private tasksService = inject(TasksService);

    onCompleteTask() {
        this.tasksService.removeTask(this.task.id);
    }
}
```

tasks.html
```html
@if (isAddingTask) {
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
                    // (complete)="onCompleteTask($event)" ya no lo vamos a usar 
                />
            </li>
        }
    </ul>
</section>
```

Key takeaway: this lesson doesn't introduce anything mechanically new — it's reinforcing that any component with access to a piece of data it owns locally (like task.id) can inject the relevant service and act on it directly, rather than always needing to emit events upward. That said, @Output still has its place (like close on NewTaskComponent) whenever the parent genuinely needs to react to something itself (e.g., closing a dialog) — DI just removes the unnecessary relaying.