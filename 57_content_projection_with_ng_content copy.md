En vez de declarar una clase global de css para ser aplicados a dos componentes distintos, usaremos la tecnica de content projection con ayuda de la directiva ng-content.

```bash
ng g c shared/card --skip-tests
```
El component card va a ser nuestro wrapper para task y user components

card.ts
```typescript
import { Component } from '@angular/core';

@Component({
    select: 'app-card', // el nombre de nuestro nuevo tag
    standalone: true,
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.css'
})
export class CardComponent {

}
```

card.component.css
```css
# cortamos esto de user.css
div {
    border-radius: 6px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
```

card.component.html
```html
<div>
    <!-- de esta manera podremos proyectar los tags hijos que este wrapper tendra -->
    <ng-content>
</div>
```

user.html (antes)
```html
<div>
    <button [class.active]="selected" (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</div>
```

user.html (despues, usando el wrapper)
```html
<!-- recuerda agregar el CardComponent en el imports del user.component.ts -->
<app-card>
    <button [class.active]="selected" (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="user.name">
        <span>{{ user.name }}</span>
    </button>
</app-card>
```

task.html (antes)
```html
<article>
    <h2>{{ task.title }}</h2>
    <time>{{ task.time }}</time>
    <p>{{ task.summary }}</p>
    <p class="actions">
        <button (click)="onCompleteTask()">Complete</button>
    </p>
</article>
```

task.html (despues)
```html
<!-- recuerda agregar el CardComponent en el imports del task.component.ts -->
<app-card>
    <article>
        <h2>{{ task.title }}</h2>
        <time>{{ task.dueDate }}</time>
        <p>{{ task.summary }}</p>
        <p class="actions">
            <button (click)="onCompleteTask()">Complete</button>
        </p>
    </article>
</app-card>
```