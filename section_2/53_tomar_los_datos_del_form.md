This lesson introduces directives as a concept, then immediately demonstrates the most common one you'll use: ngModel for two-way data binding on form inputs.

The core concept: two-way binding with ngModel

Up to now you've only seen one-way binding: [property]="value" (parent→child) and (event)="handler()" (child→parent). ngModel combines both directions into a single syntax:

```html
<input [(ngModel)]="enteredTitle" />
```

This is Angular's "banana in a box" syntax — [()] wraps ngModel. It means:

1 . [ngModel] (the box, property binding): whatever enteredTitle holds gets written into the input
2 . (ngModel) (the banana, event binding): whenever the user types, the new value gets written back into enteredTitle

So the component class field and the DOM input stay in sync automatically, in both directions — no manual (input)="enteredTitle = $event.target.value" needed.

What makes ngModel available: FormsModule

Directives (and ngModel specifically) aren't global — they have to be imported like anything else in a standalone component:

```typescript
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule], // enables ngModel
})
```

Without this import, [(ngModel)] in the template would throw an error, since Angular wouldn't recognize it as a valid attribute.

Directives vs. Components

The conceptual note at the top is worth internalizing: a directive is a component without a template. Both add behavior to elements, but a directive attaches itself to an existing element (like ngModel attaching to <input>) rather than rendering its own markup. ngModel, ngClass, ngStyle are all examples of built-in directives — you'll later learn to write your own custom ones the same way you write components, just without templateUrl.

side note: Form submission is going to be in the next lecture

```bash
ng g c tasks/new-task --skip-tests
```

tasks.component.ts
```typescript
@Component({
    ...
    imports: [TaskComponent, NewTaskComponent]
})
export class TasksComponent {
    @Input({ required: true }) userId!: string;
    @Input({ required: true }) name!: string;
    isAddingTask = false;
    
	// ...

    onStartAddTask() {
        this.isAddingTask = true;
    }

    onCancelAddTask() {
        this.isAddingTask = false;
    }
}
```

tasks.html
```html
@if (isAddingTask) {
    <app-new-task (cancel)="onCancelAddTask()" />
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
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-new-task',
    standalone: true,
    imports: [FormsModule], // este import nos habilita el ngModel
    templateUrl: '/.new-task.component.html',
    styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
    @Output() cancel = new EventEmitter<void>();
    enteredTitle = '';
    enteredSummary = '';
    enteredDate = '';

    onCancel() {
        this.cancel.emit();
    }
}
```

Agregamos click listener en el div principal y en el boton del cancel.
new-task.html
```html
<div class="backdrop" (click)="onCancel()"></div>
<dialog open>
  <h2>Add Task</h2>
  <form>
    <p>
      	<label for="title">Title</label>
	  	<!-- agregamos esta directiva para mostrar en el tag lo que el user escribe -->
		<!-- y agregamos [()] para detonar two-way biding, estamos leyendo lo que el usuario escribe y a la vez escribiendo en el dom -->
		<!-- luego elegimos en que variable decidimos alojar el valor escrito por el usuario -->
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
		<button type="button" click="onCancel()">Cancel</button>
		<button type="submit">Create</button>
    </p>
  </form>
</dialog>
```

new-task.css
```css
.backdrop {
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

dialog {
  width: 90%;
  max-width: 30rem;
  background-color: #433352;
  border-radius: 6px;
  border: none;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 1rem;
  top: 5rem;
}

h2 {
  margin: 0;
  color: #d0c2e1;
}

label {
  display: block;
  font-weight: bold;
  font-size: 0.85rem;
  color: #ab9ac0;
}

input,
textarea {
  width: 100%;
  font: inherit;
  padding: 0.15rem 0.25rem;
  border-radius: 4px;
  border: 1px solid #ab9ac0;
  background-color: #d0c2e1;
}

.actions {
  margin: 1rem 0 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
}

button {
  font: inherit;
  cursor: pointer;
  border: none;
  padding: 0.35rem 1.25rem;
  border-radius: 4px;
  background-color: transparent;
}

button[type="button"] {
  color: #bdadcf;
}

button[type="button"]:hover,
button[type="button"]:active {
  color: #d0c2e1;
}

button[type="submit"] {
  background-color: #9c73ca;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

button[type="submit"]:hover,
button[type="submit"]:active {
  background-color: #895cce;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  dialog {
    padding: 2rem;
  }
}
```
