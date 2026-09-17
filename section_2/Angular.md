ANGULAR
. 22 - 0:57 string interpolation para mostrar contenido dinamico en nuestro template: muestra un ejemplo, la variable que creamos en nuestro component ts esta disponible para usarlo en nuestro template, salvo que usamos un access modifier del tipo private. Es usado para ponerlo entre tags pero no para nombre de los atributos de los tags.
	<span>{{ selectedUser.name }}</spam>
. 23 - 1:18 en caso de querer usar la variable como el value de un atributo de un tag, por ej src del tag image usamos Property Binding usando corchetes en el nombre del atributo. mas info en lectura 24.
	<img> src="'assets/users/' + selectedUser.avatar" [alt]="selectedUser.name" />
. 25 - el src del tag img puede llegar a ser largo, entonces lo podemos computar en el componente ts, creando un getter que retorne el string completo que tenga el path que necesitamos usar en src del img.
	// componenet
	get imagePath() {
		return 'assets/users/' + this.selectedUser.avatar
	}
	// template
	<img [src]="imagePath" />
. 26 ahora mostrar como escuchar eventos para actualizar nuestra UI, por ej, una variable es modifica por ende debe suceder un cambio en la UI. Usamos parentesis en la accion del tag para denotar un listener de angular mas la accion que se va a detonar entre comillas (click)="".
	// ts
	onSelectedUser() { console.log('clicked!') }
	// html
	<button (click)="onSelectedUser" >
		Subtmit
	</button>
. 27 ahora, en vez de reaccionar a una accion y mostrar un console.log, vamos a actualizar la ui.
	// ts
	selectedUser = DUMMY_USERS[randomIndex];
	onSelectUser() {
		const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
		this.selectedUser = DUMMY_USERS[randomIndex];
	}
	get imagePath() {
		return 'assets/users/' + this.selectedUser.avatar
	}
	// html
	<button (click)="onSelectUser()">
		<img [src]="imagePath" [alt]="selectedUser.name" />
		<span>{{ selectedUser.name }}</spam>
	</button>
	
. 28 angular usa zone.js under the hood, para detectar y realizar cambios en la UI.

. 29 Introduction a signals.
La forma como venimos mostrando como funciona angular es la version antigua desde Angular 2. Signals es como un contenedor que contiene un valor, detecta si sufrio algun cambio para poder notificar a los demas componenets. Y el engine de angular se encargar de revisar que cosas cambiar para realizar el update.
// ts
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
	
	get imagePath() { return 'assets/users/' + this.selectedUser.avatar }
	
	onSelectedUser() {
		const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
		
		// this.selectedUser = DUMMY_USERS[randomIndex];
		
		this.selectedUser.set(DUMMY_USERS[randomIndex]);
		
		
	}
}

html```
<div>
	<button (click)="onSelectedUser()">
		<img [src]="imagePath" [alt]="selectedUser.name()" /> <!- ya que utilizamos signals, esta vez sí tenemos que usar paréntesis. -->
		<span>{{ selectedUser.name }}</spam>		      <!- Estamos creando un subscription que se encargará de escuchar cada   -->
	</button>						      <!- cambio que acontece. Anteriormente usabamos el subpaquete Zone.js -->
</div>								      <!- en vez de signals -->
```


// signas and zone.js es un "change detection mechanisms", signals detecta exactamente lo que se esta cambiando en cambio zone.js
// revisa tiene que revisar todos los componenets. Signals fue introducido en Angular 16 y estabilizado en el 17.
	
	
	
