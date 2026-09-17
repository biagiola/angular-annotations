<p style="font-size: 20px;">
29 - Introduction a signals.

<p style="font-size: 20px;">
La forma como venimos mostrando como funciona angular es la version antigua desde Angular 2. Signals es como un contenedor que contiene un valor, detecta si sufrio algun cambio para poder notificar a los demas componenets. Y el engine de angular se encargar de revisar que cosas cambiar para realizar el update.

<p style="font-size: 20px;">Without signals</p>

```typescript
import { DUMMY_USERS } from '../dummy-users';

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
    selectedUser = DUMMY_USERS[randomIndex];

	get imagePath() {
        return 'assets/users/' + this.selectedUser.avatar
    }

	onSelectedUser() {
		const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
		this.selectedUser = DUMMY_USERS[randomIndex];
	}
}
```
```html
<div>
	<button (click)="onSelectedUser()">
		<img [src]="imagePath()" [alt]="selectedUser.name()" /> 
		<span>{{ selectedUser.name }}</spam>		      
	</button>						      
</div>							      
```

<p style="font-size: 20px;">With signals

```typescript
import { Component, computed, signal } from '@angular/core';
import { DUMMY_USERS } from '../dummy-users';

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
	selector: 'app-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.css',
})
export class UserComponent {
	selectedUser = signal(DUMMY_USERS[randomIndex]);

    imagePath = compute(() => 'assets/users/' + this.selectedUser().avatar);

	onSelectedUser() {
		const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
		
		this.selectedUser.set(DUMMY_USERS[randomIndex]);
	}
}
```
```html
<div>
	<button (click)="onSelectedUser()">
		<img [src]="imagePath()" [alt]="selectedUser.name()" /> 
		<span>{{ selectedUser.name }}</spam>		      
	</button>						      
</div>							      
<!- ya que utilizamos signals, esta vez sí tenemos que usar paréntesis. -->
<!- Estamos creando un subscription que se encargará de escuchar cada   -->
<!- cambio que acontece. Anteriormente usabamos el subpaquete Zone.js -->
```

<p style="font-size: 20px;">
signas and zone.js es un "change detection mechanisms", signals detecta exactamente lo que se esta cambiando en cambio zone.js revisa tiene que revisar todos los componenets. Signals fue introducido en Angular 16 y estabilizado en el 17.
