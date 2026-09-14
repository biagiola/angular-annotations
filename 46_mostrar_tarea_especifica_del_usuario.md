
```typescript
@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [],
    templateUrl: './taks.component.css',
    styleUrl: 'tasks.component.css',
    imports: [TaskComponent]
})
export class TasksComponent {
    @Input({ required: true }) userId!: string;
    @Input({ required: true }) name!: string;
    
    tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary: 'Learn all the basic and advance features of Angular & how to apply them',
            dueDate: '2025-12-31'
        }
        ...
    ];

    get selectedUserTasks() {
        return this.tasks.filter((task) => task.userId === this.userId)
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
        <!-- en vez de iterar todas los tasks -->
        <!-- @for (task of tasks; track task.id) { -->

        <!-- Iteramos solo lo que necesitamos -->
        @for (task of selectedUserTasks; track task.id) {
            <li>
                <app-task />
            </li>
        }
    </ul>
</section>
```

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
App.html
```html
<app-header />
<main>
    <ul>
        @for(user of users; track user.id) {
            <li>
                <app-user [user]="user" (select)="onSelectUser($event)" />
            </li>
        }
    </ul>

    if (selectedUser) {
        <app-tasks [userId]="selectedUser.id" [name]="selectedUser.name">
    } @else {
        <p id="fallback">Select a user to see their tasks!!</p>
    }
    
</main>
```