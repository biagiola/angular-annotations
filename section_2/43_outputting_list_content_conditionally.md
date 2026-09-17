Motraremos el contenido solo si esta definido (cuando el usuario da un click).

app.ts
```typescript
export class AppComponent {
    users = DUMMY_USERS;
    selectedUserId?: string; // no lo inicializamos

    onSelectUser(id: string) {
        selectedUserId = id;
    }
}
```

```html
<app-header />
<main>
    <ul>
        <!-- ahora -->
        @for(user of users; track user.id) {
            <li>
                <app-user [user]="user" (select)="onSelectUser($event)" />
            </li>
        }
    </ul>

    if (selectedUser) {
        <app-tasks [name]="selectedUser.name">
    } @else {
        <p id="fallback">Select a user to see their tasks!!</p>
    }
    
</main>
```