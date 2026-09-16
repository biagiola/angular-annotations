Por le momento, cada vez que cliqueamos la lista de usuarios, solo aparece su nombre, pero ahora le agregaremos mas cosas, incluyendo el boton para agregar tareas. Tambien agregaremos un componente individual para cada tarea del usuario

```bash
ng g c tasks/task --skip-tests
```

tasks.ts
```typescript
@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [],
    templateUrl: './taks.component.css',
    styleUrl: 'tasks.component.css',
    imports: [TaskComponent] // lo importamos al component padre
})
export class TasksComponent {
    @Input() name?: string;
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
        <li>
            <app-task /> <!-- llamada -->
        </li>
    </ul>
</section>
```

por el momento el component Task va a ser algo dummy
task.html
```html
<article>
    <h2>Task Title</h2>
    <time datetime="">Time</time>
    <p>Summary</p>
    <p class="actions">
        <button>Complete</button>
    </p>
</article>
```