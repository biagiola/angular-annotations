import { NgModule } from "@angular/core";
import { CardComponent } from "./card/card.component";

@NgModule({
    declarations: [CardComponent],
    exports: [CardComponent] // en exports tenemos que tener todos los componentes que usa Card pero tambien los demas que van a usar este shared module como por ejemplo User.
})
export class SharedModule {}

// side note: solo el component root usa la propieda bootstrap dentro del NgModule

// en export CardCompoente, estamos exportantdo para todos los demas component que utilizen shared.module, como es el caso del component Users