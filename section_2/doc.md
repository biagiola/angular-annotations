# ANGULAR

<p style="font-size: 20px;">
. 22 - 0:57 string interpolation para mostrar contenido dinamico en nuestro template: muestra un ejemplo, la variable que creamos en nuestro component ts esta disponible para usarlo en nuestro template, salvo que usamos un access modifier del tipo private. Es usado para ponerlo entre tags pero no para nombre de los atributos de los tags.
</p>

```html
<span>{{ selectedUser.name }}</spam>
```

<p style="font-size: 20px;">
. 23 - 1:18 en caso de querer usar la variable como el value de un atributo de un tag, por ej src del tag image usamos Property Binding usando corchetes en el nombre del atributo. mas info en lectura 24.
</p>

```html
<img> src="'assets/users/' + selectedUser.avatar" [alt]="selectedUser.name" />
```

<p style="font-size: 20px;">
. 25 - el src del tag img puede llegar a ser largo, entonces lo podemos computar en el componente ts, creando un getter que retorne el string completo que tenga el path que necesitamos usar en src del img.
</p>

```typescript
// componenet
get imagePath() {
	return 'assets/users/' + this.selectedUser.avatar
}
```
```html
<img [src]="imagePath" />
```

<p style="font-size: 20px;">
. 26 ahora mostrar como escuchar eventos para actualizar nuestra UI, por ej, una variable es modifica por ende debe suceder un cambio en la UI. Usamos parentesis en la accion del tag para denotar un listener de angular mas la accion que se va a detonar entre comillas (click)="".
</p>

```typescript
// ts
onSelectedUser() { console.log('clicked!') }
```
```html
// html
<button (click)="onSelectedUser" >
	Subtmit
</button>
```

<p style="font-size: 20px;">
. 27 ahora, en vez de reaccionar a una accion y mostrar un console.log, vamos a actualizar la ui.
</p>

```typescript
// ts
selectedUser = DUMMY_USERS[randomIndex];
onSelectUser() {
	const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
	this.selectedUser = DUMMY_USERS[randomIndex];
}
get imagePath() {
	return 'assets/users/' + this.selectedUser.avatar
}
```
```html
// html
<button (click)="onSelectUser()">
	<img [src]="imagePath" [alt]="selectedUser.name" />
	<span>{{ selectedUser.name }}</spam>
</button>
```

<p style="font-size: 20px;">
. 28 angular usa zone.js under the hood, para detectar y realizar cambios en la UI.

<p style="font-size: 20px;">
. 29 Introduction a signals.
La forma como venimos mostrando como funciona angular es la version antigua desde Angular 2. Signals es como un contenedor que contiene un valor, detecta si sufrio algun cambio para poder notificar a los demas componenets. Y el engine de angular se encargar de revisar que cosas cambiar para realizar el update.

```typescript
// with signals
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
<!- with signals -->
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

```typescript
// without signals
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

<!- without signals -->
<div>
	<button (click)="onSelectedUser()">
		<img [src]="imagePath()" [alt]="selectedUser.name()" /> 
		<span>{{ selectedUser.name }}</spam>		      
	</button>						      
</div>							      
```

<p style="font-size: 20px;">
signas and zone.js es un "change detection mechanisms", signals detecta exactamente lo que se esta cambiando en cambio zone.js revisa tiene que revisar todos los componenets. Signals fue introducido en Angular 16 y estabilizado en el 17.


<p style="font-size: 20px;">

