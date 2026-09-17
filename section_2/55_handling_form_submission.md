Let's use directive and two-way binding. Directives allows you to add extra functionalities to elements. In the end, directive are almost like components, unlike they dont have templates. Components are directives with templates.

This lesson closes the loop: capturing form data, emitting it up as a typed object, and using it to construct a new item in the parent's array — completing the full add-task flow.

The core concept: form submission via (ngSubmit)
```html
<form (ngSubmit)="onSubmit()">
```

(ngSubmit) is Angular's own event binding for form submission — it fires when the form submits, but Angular automatically calls preventDefault() for you (this is what FormsModule gives you, per the comment in the code). That's why there's no manual event.preventDefault() anywhere: normally a <button type="submit"> inside a <form> triggers a native browser submission (page reload), but FormsModule + (ngSubmit) intercepts that so everything stays client-side in Angular.

The data flow, end to end
1 . new-task.ts: onSubmit() bundles the three ngModel-bound fields into an object typed as NewTaskData and emits it: this.add.emit({ title, summary, date }).
2 . tasks.html: (add)="onAddTask($event)" listens for that emitted object.
3 . tasks.component.ts: onAddTask(taskData: NewTaskData) receives it and builds a full Task object (adding an id and the userId), then adds it to this.tasks.
4 . Because selectedUserTasks is a getter that filters this.tasks, the @for loop picks up the new task automatically — no extra "refresh" logic needed.

task.model.ts
```typescript
export interface Task {
    id: string;
    userId: string;
    title: string;
    summary: string;
    dueDate: string;
}

export interface NewTaskData {
    title: string;
    summary: string;
    date: string
}
```

tasks.component.ts
```typescript
...
export class TasksComponent {
    @Input({ required: true }) userId!: string;
    @Input({ required: true }) name!: string;
    isAddingTask = false;
    
    // ...

    onCancelAddTask() {
        this.isAddingTask = false;
    }

    onAddTask(taskData: NewTaskData) {
        // lo coloca al final
        // this.tasks.push({
        //     id: new Date().getTime().toString(),
        //     userId: this.userId,
        //     title: taskData.title,
        //     summary: taskData.summary,
        //     dueDate: taskData.date
        // });

        // lo coloca al comienzo
        this.tasks.unshift({
            id: new Date().getTime().toString(),
            userId: this.userId,
            title: taskData.title,
            summary: taskData.summary,
            dueDate: taskData.date
        });

        this.isAddingTask = false;
    }
}
```

tasks.html
```html
@if (isAddingTask) {
    <!-- agregar el elemento para escuchar el evento add -->
    <app-new-task (cancel)="onCancelAddTask()" (add)="onAddTask($event)" />
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

new-task.ts
```typescript
...
@Component({
    selector: 'app-new-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './new-task.component.html',
    styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
    @Output() cancel = new EventEmitter<void>();
    
    // creamos un nuevo output para que lo escuche el componente padre (tasks)
    // donde guardaremos los valores del form.
    @Output() add = new EventEmitter<NewTaskData>();

	enteredTitle = '';
	enteredSummary = '';
	enteredDate = '';

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        this.add.emit({
            title: this.enteredTitle,
            summary: this.enteredSummary,
            date: this.enteredDate
        })
    }
}
```

Agregamos click listener en el div principal y en el boton del cancel.
new-task.html
```html
<div class="backdrop" (click)="onCancel()"></div>
<dialog open>
  <h2>Add Task</h2>
  <!-- queremos ser notificados cuando el envio sea ejecutado entonces usamos ngSubmit -->
  <form (ngSubmit)="onSubmit()">
    <p>
        <label for="title">Title</label>
        <input type="text" id="title" name="title" [(ngModel)]="enteredTitle" />
    </p>

    <p>
        <label for="summary">Summary</label>
        <textarea id="summary" rows="5" name="summary" [(ngModel)]="enteredSummary"></textarea>
    </p>

    <p>
        <label for="due-date">Due Date</label>
        <input type="date" id="due-date" name="due-date" [(ngModel)]="enteredDate" />
    </p>

    <p class="actions">
        <!-- si tenemos un button dentro de un form, automaticamente cuando lo presionemos -->
        <!-- el submit del form se ejecutara, es la funcionalida del html, debemos prevenir ese comportamiento -->
        <!-- el request tiene que quedar del lado del cliente en el javascript, nuestro angular. -->
        <!-- Eso no permite por defecto hacer el FormsModule al importarlo  -->
        <button type="button" (click)="onCancel()">Cancel</button>
        <button type="submit">Create</button>
    </p>
  </form>
</dialog>
```

One more thing worth noting for later: right now the form doesn't reset or get destroyed after adding a task in a way that's obviously visible in this snippet — but since isAddingTask = false at the end of onAddTask, the @if unmounts <app-new-task> entirely, which destroys the component and its state. So next time it opens, the fields will be blank again — that's a nice side effect of the @if-based show/hide approach from a couple lessons ago.

Key takeaway: (ngSubmit) + FormsModule gives you a clean, no-page-reload form submission flow, and the "shape data on the way up, reshape it again in the parent" pattern (NewTaskData → full Task) is a common way to keep form components decoupled from how their data is ultimately stored.