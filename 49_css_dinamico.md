The core concept: conditional class binding

The new piece is in user.html:

```html
<button [class.active]="selected" (click)="onSelectUser()">
```

[class.active]="selected" is Angular's class binding syntax: [class.CLASSNAME]="expression". When selected is true, Angular adds the active class to the button; when false, it removes it. That's what triggers the .active CSS rule (purple background) in user.component.css.

How the boolean flows down

To make [class.active] work, selected has to come from the parent as an @Input:

1 . app.html computes it inline: [selected]="user.id === selectedUserId" — a simple equality check per user in the loop, so only the matching one gets true.
2 . user.component.ts receives it via @Input({ required: true }) selected!: boolean;
3 . user.html binds it to the class.

This is the standard pattern for "is this item the active/selected one in a list" styling — compute a boolean in the parent's loop, pass it down, bind it to a class in the child.

app.component.ts
```typescript
export class AppComponent {
    users = DUMMY_USERS;
    selectedUserId?: string; // <-- ya tenemos el userId para utilizarlo

    get onSelectUser() {
        return this.users.find((user) => user.id === this.selectedUserId);
    }

    onSelectedUser(id: string) {
        this.selectedUserId = id;
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
                    (select)="onSelectedUser($event)"
                />
            </li>
        }
    </ul>

    @if (selectedUser) {
        <app-tasks [userId]="selectedUser.id" [name]="selectedUser.name" />
    } @else {
        <p id="fallback">Select a user to see their tasks!!</p>
    }
</main>
```

user.ts
```typescript
@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    @Input({ required: true }) user!: User;
    @Input({ required: true }) selected!: boolean;
    @Output() select = new EventEmitter();

    get imagePath() {
        return 'assets/users/' + this.user.avatar;
    }

	onSelectedUser() {
        this.select.emit(this.user.id);
    }
}
```

user.html (before)
```html
<div>
    <!-- tenemos que agregar el css condicionalmente si el usuario fue seleccionado -->
    <button (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```

user.html (after)
```html
<div>
    <!-- con este directiva podemos condicionar la clase del css -->
    <button [class.active]="selected" (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```

user.component.css
```css
.active {
    background-color: #9965dd;
    color: #150722;
}
```
