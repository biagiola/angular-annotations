crear un componente
```bash
ng g c taksk --skip-tests
```

app.ts
```typescript
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {} from './user/user.component';
import { DUMMY_USERS } from './dummy-users';

@Component({
	selector: 'app-user',
	standalone: true,
    imports: [HeaderComponent, UserComponent, TasksComponent],
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class AppComponent {
    users = DUMMY_USERS;
    selectedUserId = 'temporal_id';

    get selectedUser() {
        return this.users.find((user) => user.id === selectedUserId)!;
        // con ! estamos diciendo a typescript que no existe el caso donde
        // no encontraremos un user, por ende, encontrarnos con un undefined.
        // no es correcto usar aca !, pero lo detallaremos en el siguiente documento.
    }
    onSelectUser(id: string) {
        selectedUserId = id;
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
        <!-- aquí van los demás li (más adelante se mostrarán como hacer loops en el template)... -->
    </ul>

    <!-- llamamos al getter que nos returna el objecto user y accedemos al name -->
    <app-tasks [name]="selectedUser.name">
</main>
```

Realmente el nombre del archivo es tasks.component.ts, el cual es utilizado en el import de app.ts, pero lo hacemos corto acá.
```typescript
import { Component, Input } from '@angular/core';

@Component({
    selector: "app-tasks",
    standalone: true,
    imports: [],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
})
export class TaskComponent {
    @Input({ required: true }) name!: string;
}
```

task.html
```html
<h2>{{ name }}</h2>
```
