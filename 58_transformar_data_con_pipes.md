
task.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { type Task } from './task.model';
import { CardComponent } from '../../shared/card/card.component";

@Component({
    selector: 'app-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrl: './task.component.css'
    imports: [CardComponent, DatePipe], // agrega el pipe a nuestro import
})
export class TaskComponent {
    @Input({ required: true }) task!: Task;
    @Output() complete = new EventEmitter<string>();

    onCompleteTask() {
        this.complete.emit(this.task.id);
    }
}
```

task.html
```html
<app-card>
    <article>
        <h2>{{ task.title }}</h2>
        <!-- transforma nuestro dato en nueva forma mas estandarizada -->
        <time>{{ task.dueDate | date }}</time>
        <p>{{ task.summary }}</p>
        <p class="actions">
            <button (click)="onCompleteTask()">Complete</button>
        </p>
    </article>
</app-card>
```

Other formats
```html
<time>{{ task.dueDate | date:'short' }}</time>
<time>{{ task.dueDate | date:'medium' }}</time>
<time>{{ task.dueDate | date:'long' }}</time>
<time>{{ task.dueDate | date:'fullDate' }}</time>
```

Mas info: https://angular.dev/api/common/DatePipe
