anteriormente estabamos harcodeando la lista de usuarios en el template pero ahora utlizaremos un for loop en el html
app.html
```html
<app-header />
<main>
    <ul>
        <!-- anteriormente -->
        <li>
            <app-user
                [user]="users[0]"
                (select)="onSelectUser($event)"
            />
        </li>
        <li>
            <app-user
                [user]="users[1]"
                (select)="onSelectUser($event)"
            />
        </li>
        ...

        <!-- ahora -->
        @for(user of users; track user.id) {
            <li>
                <app-user [user]="user" (select)="onSelectUser($event)" />
            </li>
        }
    </ul>

    <app-tasks [name]="selectedUser ? selectedUser.name : ''">
</main>
```