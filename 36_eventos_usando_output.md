Ouput y output como la misma cosa, event emitters pero con otra sintáxis. No así el input function (input.required) que si es un signal, no así el input decorator (@Input). La función derocador de output podría usarse solo para ser igual al input function y ambos tener misma sintáxis.

App.ts and app.html se mantienen igual.
```typescript
import { Component, Input, output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    @Input({ required: true }) id!: string;
    @Input({ required: true }) avatar!: string;
    @Input({ required: true }) name!: string;

    // @Output() select = new EventEmitter<string>();
    select = output<string>();

    get imagePath() {
        return 'assets/users/' + this.avatar();
    }

	onSelectedUser() {
        this.select.emit(this.id);
    }
}
```
user.html

```html
<div>
    <button (click)="onSelectedUser()">
        <img [src]="imagePath" [alt]="name">
        <span>{{ name }}</span>
    </button>
</div>
```