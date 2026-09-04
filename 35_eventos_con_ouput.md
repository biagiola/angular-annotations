

app.ts
```typescript
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {} from './user/user.component';
import { DUMMY_USERS } from './dummy-users';

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class AppComponent {
    users = DUMMY_USERS;

    // este es nuestro event personalizado (custom event)
    onSelectUser(id: string) {
        console.log('Selected user with id' + id);
    }
}
```

app.html
```html
<app-header />
<main>
    <ul>
        <li>
            <app-user
                [id]="users[0].id"
                [avatar]="users[0].avatar"
                [name]="users[0].name"
                (select)="onSelectUser($event)"
            />
        </li>
        <li>
            <app-user
                [id]="users[1].id"
                [avatar]="users[1].avatar"
                [name]="users[1].name"
                (select)="onSelectUser($event)"
            />
        </li>
        <li>
            <app-user
                [id]="users[2].id"
                [avatar]="users[2].avatar"
                [name]="users[2].name"
                (select)="onSelectUser($event)"
            />
        </li>
        <li>
            <app-user
                [id]="users[3].id"
                [avatar]="users[3].avatar"
                [name]="users[3].name"
                (select)="onSelectUser($event)"
            />
        </li>
    </ul>
</main>
<!-- users es un array normal de ts, no un signal -->
```

Para este ejemplo donde se muestra como usar eventos y outputs, vamos a hacerlo sin usar signals.
user.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    @Input({ required: true }) id!: string;
    @Input({ required: true }) avatar!: string;
    @Input({ required: true }) name!: string;
    @Output() select = new EventEmitter();

    get imagePath() {
        return 'assets/users/' + this.avatar();
    }

	onSelectedUser() {
        this.select.emit(this.id);
    }
}
```
user.html

```html
<div>
    <button (click)="onSelectedUser()">
        <img [src]="imagePath" [alt]="name">
        <span>{{ name }}</span>
    </button>
</div>
```