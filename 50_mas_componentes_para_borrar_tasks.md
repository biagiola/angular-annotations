This lesson is about child-to-parent communication for removing/completing an item from a list — the reverse-direction counterpart to the @Input pattern you've been using.

The core concept: emitting an event upward to mutate parent state

The task itself (TaskComponent) doesn't own the task list — TasksComponent does. So when a task is "completed" (which here really means removed from the list), the click has to happen in the child, but the actual array mutation has to happen in the parent. That's done with @Output() + EventEmitter:

1. task.ts: @Output() complete = new EventEmitter<string>(); — declares an event the child can emit, typed to carry a string (the task id).
2 . task.html: (click)="onCompleteTask()" triggers a local method...
3 . ...which calls this.complete.emit(this.task.id) — sending the id up to whoever's listening.
4 . tasks.html: (complete)="onCompleteTask($event)" listens for that event on <app-task>. $event here is exactly what was passed to .emit(...) — the task id.
5 . tasks.component.ts: onCompleteTask(id: string) receives that id and (once filled in) would filter it out of this.tasks, e.g.:
```typescript
   onCompleteTask(id: string) {
       this.tasks = this.tasks.filter((task) => task.id !== id);
   }
```

So the pattern is: state lives in the parent → child emits an event with just enough data (the id) → parent's handler uses that id to update its own state → Angular re-renders the @for loop automatically since selectedUserTasks is a getter that recomputes from tasks.

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
