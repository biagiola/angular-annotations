

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
}
```

app.html
```html
<app-header />
<main>
    <ul>
        <li>
            <app-user [avatar]="users[0].avatar" [name]="users[0].name" />
        </li>
        <li>
            <app-user [avatar]="users[1].avatar" [name]="users[1].name" />
        </li>
        <li>
            <app-user [avatar]="users[2].avatar" [name]="users[2].name" />
        </li>
        <li>
            <app-user [avatar]="users[3].avatar" [name]="users[3].name"/>
        </li>
    </ul>
</main>
```

user.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    @Input({ required: true }) avatar!: string;
    @Input({ required: true }) name!: string;

    get imagePath() {
        return 'assets/users/' + this.avatar 
    }

	onSelectedUser() {}
}

    // Typescript rule
    // avatar! -> si o si vamos a recibir un valor
    // avatar? -> puede que tengamos un undefined

    // Angular rule
    // @Input({ <possible_values> })
    // possible_values -> alias, required, transform, transform(value)
```
user.html

```html
<div>
    <button (click)="onSelectedUser()">
        <img [src]="imagePath" [alt]="">
        <span>{{ name }}</span>
    </button>
</div>
```