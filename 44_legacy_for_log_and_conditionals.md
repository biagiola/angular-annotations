En codigo legacy usamos structural directive (ngFor, ngIf) para ello tenemos que importarlo

app.ts
```typescript
import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
...

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
    imports: [HeaderComponent, UserComponent, TasksComponent, NgFor, NgIf]
})
export class AppComponent {
    users = DUMMY_USERS;
    selectedUserId?: string;

    onSelectUser(id: string) {
        selectedUserId = id;
    }
}
```

```html
<app-header />
<main>
    <ul>
        <li *ng="let user of users">
            <app-user [user]="user" (select)="onSelectUser($event)" />
        </li>
    </ul>

    
        <app-tasks *ng="selectedUser"; else "fallback" [name]="selectedUser!.name">
        <!-- en este caso, como no esta el if puede que no exista selectedUser asi que usamos el !-->
    
        <ng-template #fallback>
            <p id="fallback">Select a user to see their tasks!!</p>
        </ng-template>
        <!-- fallback es el identificador que decidimos ponerle, puede ser otro valor -->
    
    
</main>
```

En el caso que teniamos anteriormente, @for, no necesita ser unlocked. No es un structural directive mas bien un template feature construido en Angular.