user.component.css
```css
.active {
    background-color: #9965dd;
    color: #150722;
}
```

user.component.html
```html
<div>
    <!-- tenemos que agregar el css condicionalmente si el usuario fue seleccionado -->
    <button (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```

app.component.ts
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
    selectedUserId?: string; // <-- ya tenemos el userid para utilizarlo

    get onSelectUser(id: string) {
        return this.users.find((user) => user.id === this.selectedUserId);
    }

    onSelectedUser(id: string) {
        this.selectedUserId = id;
    }
}
```

user.component.ts
```typescript
@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    @Input({ require: true }) user!: User;
    @Input({ require: true }) selected!: boolean;
    @Output() select = new EventEmmiter();

    get imagePath() {
        return 'assets/users/' + this.user.avatar;
    }

	onSelectedUser() {
        this.select.emit(this.user.id);
    }
}
```

App.html
```html
<app-header />
<main>
    <ul>
        @for(user of users; track user.id) {
            <li>
                <app-user
                    [user]="user"
                    [selected]="user.id === selectedUserId" -- si son iguales retorna true
                    (select)="onSelectUser($event)"
                />
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

user.html
```html
<div>
    <button [class.active]="selected" (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```