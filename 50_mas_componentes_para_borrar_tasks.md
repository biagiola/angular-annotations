tasks.component.ts
```typescript
export class TasksComponent {
    @Input({ required: true }) userId!: string;
    @Input({ required: true }) name!: string;
    tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary: 'Learn all the basic and advance feature of Angular and how to apply them.',
            dueDate: '2025-12-31'
        },
        // ...
    ];

    get selectedUserTasks() {
        return this.tasks.filter((task) => task.userId === this.userId);
    }

    onCompleteTask(id: string) {
        // ...
    }
}
```

tasks.html
```html
<section id="taks">
    <header>
        <h2>{{ name }}'s Tasks</h2>
    </header>
    <menu>
        <button>Add Task</button>
    </menu>
    <ul>
        @for (task of selectedUserTasks; track task.id) {
            <li>
                <app-task
                    [task]="task"
                    (complete)="onCompleteTask($event)" // event nos da acceso al dato del evento que emitimos
                />
            </li>
        }
    </ul>
</section>
```

task.ts
```typescript
import { Component, Input } from '@angular/core';
import { type Task } from './task.model';

interface Task = {
    id: string;
    userId: string;
    title: string;
    summary: string;
    dueDate: string;
}

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [],
    templateUrl: './task.component.html',
    styleUrl: './task.component.css'
})
export class TaskComponent {
    @Input({ required: true }) task!: Task;
    @Output() complete = new EventEmitter<string>();

    onCompleteTask() {
        this.complete.emit(this.task.id);
    }
}
```

task.html
```html
<article>
    <h2>{{ task.title }}</h2>
    <time>{{ task.time }}</time>
    <p>{{ task.summary }}</p>
    <p class="actions">
        <button (click)="onCompleteTask()">Complete</button>
    </p>
</article>
```
