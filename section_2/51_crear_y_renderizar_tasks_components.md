Let's make a dialog for our form new task and make it closable.

This lesson covers conditionally rendering a modal/dialog component and closing it via two different triggers — building on the @Output/EventEmitter pattern from last time, now applied to toggling visibility instead of removing data.

The core concept: boolean flag controls a child component's existence
1 . isAddingTask in TasksComponent is the single source of truth for "is the dialog open."
2 . tasks.html wraps <app-new-task> in @if (isAddingTask) — so the component isn't just hidden with CSS, it's not even created until the flag is true. This matters: Angular fully destroys/recreates it each toggle, which also resets the form fields automatically.
3 . onStartAddTask() (wired to the "Add Task" button) flips the flag to true.
4 . onCancelAddTask() flips it back to false, and is passed down as a handler for the child's (cancel) event.
The "closable" part: two ways to trigger the same event

NewTaskComponent exposes one @Output() cancel, but two different UI elements in its own template trigger it:

Clicking the backdrop (<div class="backdrop" (click)="onCancel()">) — the semi-transparent overlay behind the dialog
Clicking the Cancel button inside the form

Both call the same local onCancel() method, which does this.cancel.emit(). The parent doesn't know or care which one was clicked — it just gets told "cancel happened" and reacts once (isAddingTask = false).

This "backdrop click closes modal" is a very common UI pattern, and doing it this way (rather than, say, a global click listener) keeps it scoped cleanly to the component.

The native <dialog> element

Worth noting: this template uses the actual HTML <dialog> tag with the open attribute — a real, semantic, built-in element (not a generic styled <div>). It's a nice example of pairing native HTML modal semantics with Angular's structural control flow.

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

    // single source of true para saber si el dialog esta abierto
    isAddingTask = false;
    
    // ...

    // este metodo se encargara de modificar la variable existente en el componente hijo
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
                <!-- el evento complete nos da acceso al dato del evento que emitimos -->
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

@Component({
    selector: 'app-new-task',
    standalone: true,
    imports: [],
    templateUrl: '/.new-task.component.html',
    styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
    // cancel es la propierdad html de este tag hijo app-new-task, el cual sera enlazado (binding)
    // con el metodo que cambia el estado del dialog en el component padre
    @Output() cancel = new EventEmitter<void>();

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
      <input type="text" id="title" name="title" />
    </p>

    <p>
      <label for="summary">Summary</label>
      <textarea id="summary" rows="5" name="summary"></textarea>
    </p>

    <p>
      <label for="due-date">Due Date</label>
      <input type="date" id="due-date" name="due-date" />
    </p>

    <p class="actions">
      <button type="button" (click)="onCancel()">Cancel</button>
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
