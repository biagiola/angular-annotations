En vez de declarar una clase global de css para ser aplicados a dos componentes distintos, usaremos la tecnica de content projection con ayuda de la directiva ng-content.

This lesson is about content projection — a way to build a reusable "wrapper" component that shares styling/structure across multiple unrelated components, without duplicating CSS.

The core concept: <ng-content>

The problem being solved: UserComponent and TaskComponent both had near-identical CSS (rounded corners, shadow, overflow hidden) duplicated across two separate .css files. Instead of copy-pasting that styling everywhere, you extract it into one shared wrapper component.

<ng-content> is the mechanism that makes this possible:

```html
<!-- card.component.html -->
<div>
    <ng-content></ng-content>
</div>
```

This tells Angular: "whatever markup gets placed between <app-card> and </app-card> by whoever uses this component — render it right here." It's essentially a placeholder/slot for external content, similar in spirit to {children} in React or <slot> in Web Components.

How it's used

Instead of UserComponent and TaskComponent each having their own <div>/<article> wrapper with duplicated card styling, they now project their actual content into <app-card>:

```html
<app-card>
    <button [class.active]="selected" (click)="onSelectUser()">
        ...
    </button>
</app-card>
```

CardComponent doesn't know or care what's inside — it just provides the outer <div> and the shared CSS. The <button> (or <article>, for tasks) gets slotted into where <ng-content> sits.

Why this matters
1 . DRY styling: one .css file (card.component.css) now owns the "card" look, instead of two nearly-identical copies.
2 . Composition over duplication: CardComponent is a purely structural/presentational wrapper — it has no logic, no inputs, nothing. It's the simplest possible component, existing only to project content into consistent markup.
3 . This is a different composition pattern than @Input/@Output — those pass data, while content projection passes markup/templates itself.

```bash
ng g c shared/card --skip-tests
```
El component card va a ser nuestro wrapper para task y user components

card.ts
```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-card', // el nombre de nuestro nuevo tag
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
/* cortamos esto de user.css */
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
    <ng-content></ng-content>
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

Key takeaway: <ng-content> lets a component act as a generic "shell" or "wrapper" that projects whatever content its consumer places inside its tags — useful for shared layout/styling (cards, modals, panels) without needing @Inputs to pass markup around, since you're passing actual template content, not just data.