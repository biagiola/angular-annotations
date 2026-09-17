User.component.ts
```typescript
import { Component, Input, output, EventEmitter } from '@angular/core';

type User = {
    id: string;
    avatar: string;
    name: string;
}

// same as above
interface User = {
    id: string;
    avatar: string;
    name: string;
}

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    // antes
    @Input({ required: true }) id!: string;
    @Input({ required: true }) avatar!: string;
    @Input({ required: true }) name!: string;

    // ahora
    @Input({ require: true }) user: User;

    // @Output() select = new EventEmitter<string>();
    select = output<string>();

    get imagePath() {
        return 'assets/users/' + this.user.avatar;
    }

	onSelectedUser() {
        this.select.emit(this.user.id);
    }
}
```

user.html
```html
<div>
    <button (click)="onSelectedUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```

app.component.html
```html
<li>
    <app-user>
        [user]="users[0]"
        (select)="onSelectUser($event)"
    </app-user>
        <app-user>
        [user]="users[1]"
        (select)="onSelectUser($event)"
    </app-user>
    ...    
</li>
```