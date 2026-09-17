

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
<!-- users es un array normal de ts, no un signal -->
```

user.ts
```typescript
import { Component, input, computed } from '@angular/core';

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    avatar = input.required<string>();
    name = input.required<string>();

    imagePath = computed(() => {
        return 'assets/users/' + this.avatar()
    });

    // los inputs ahora son de solo lectura, leemos el keystroke del usuario
    // y lo mostramos en la ui, pero si queremos modificarlo en logica ts no podemos.
	onSelectedUser() {
        // this.avatar.set(); // no podemos hacer esto por ej.
    }
}

    // typescript rule
    // avatar = input(''); // inicializando, infiere el tipado
    // avatar = input<string>(); // sin inicializacion y especificando el tipado. Generic types

    // Angular rule
    // avatar = input.required<string>();

    // Compute
    // es mas eficiente que usar el antiguo get imagePath() {}, porque antes se llamaba al get
    // cuando cualquier update pasaba en el componente entero.
```
user.html

```html
<div>
    <button (click)="onSelectedUser()">
        <img [src]="imagePath" [alt]="name()">
        <span>{{ name() }}</span>
    </button>
</div>
```