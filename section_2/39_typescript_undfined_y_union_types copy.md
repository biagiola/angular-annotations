El signo ! es para decirle a typescript que el valor nunca va a estar undefined, y para este caso es correcto porque marcamos como required nuestra variable con ayuda del angular.
```typescript
    @Input({ required: true }) name!: string; 
```

En cambio para este caso del find, no es el caso en donde sabremos de antemano que no habrá el caso de undefined, al contrario, podría darse el undefined, lo cual estaría mal usar el !.
app.ts
```typescript
get selectedUser() {
    return this.users.find((user) => user.id === selectedUserId)!; // no es correcto
}
```

Lo mejor sería considerar un fallback, en caso de que nos topemos con el undefined, este es un ejemplo de que podríamos hacer.
Por ejemplo, en tasks, usando ?, decimos a typescript que podría no existir o ser inicializado.
```typescript
export class TasksComponent {
    @Input() name?: string;
}
```

cuando algo podría ser undefined, no genera problemas en el template por ej aquí
tasks.html
```html
<h2>{{ name }}</h2>
```

Pero sí en en un archivo .ts ejemplo
app.html
```html
<app-header />
<main>
    <ul>
        <!-- ... -->
    </ul>

    <!-- aquí si queremos acceder a la propiedad de algo undefined, salvo que usemos ? -->
    <app-tasks [name]="selectedUser?.name">

    <!-- sería lo mismo si usamos ternary operator -->
    <app-tasks [name]="selectedUser ? selectedUser.name : 'user does not exists' ">
</main>
```

Otra forma de escribir el undefiend es usando el símbolo |, es la técnica de union type.
```typescript
export class TasksComponent {
    @Input() name: string | undefined;
}
```