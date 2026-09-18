# Standalone Components vs. NgModules

Comparison between the two sample projects in this section:

- `01-starting-project-using-standalone/` — standalone components
- `02-starting-project-using-modules/` — classic `NgModule`-based setup

Both apps implement the exact same task-management UI (`Header` → `User` list → `Tasks`),
so every difference below comes purely from the architecture, not the feature set.

## 1. Bootstrapping the app (`main.ts`)

| Standalone | Modules |
|---|---|
| `bootstrapApplication(AppComponent)` from `@angular/platform-browser` | `platformBrowserDynamic().bootstrapModule(AppModule)` from `@angular/platform-browser-dynamic` |
| Boots directly off a **component** | Boots off a **module**, which in turn declares the root component via `bootstrap: [AppComponent]` |

No `AppModule` exists at all in the standalone project — the component tree is the
only unit of composition.

## 2. Declaring a component

Standalone (`header.component.ts`, `card.component.ts`, etc.):

```ts
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {}
```

Module-based:

```ts
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {}
```

- `standalone: true` is the flag that opts a component out of needing an `NgModule`
  (in this project's Angular version it must still be set explicitly; newer Angular
  versions default to standalone and drop the flag).
- A component that isn't standalone **must** be listed in some `NgModule`'s
  `declarations` array or Angular won't know it exists. The module project marks this
  explicitly with `standalone: false` on `AppComponent`.

## 3. Where dependencies come from

This is the biggest practical difference.

**Standalone** — every component lists exactly what *it* needs in its own `imports`:

```ts
// new-task.component.ts
@Component({
  standalone: true,
  imports: [FormsModule],   // needed here for ngModel
  ...
})
export class NewTaskComponent { ... }
```

```ts
// user.component.ts
@Component({
  standalone: true,
  imports: [CardComponent],  // needed here to use <app-card> in the template
  ...
})
export class UserComponent { ... }
```

Dependencies are **local and explicit** — reading one component's decorator tells you
everything it depends on.

**Modules** — dependencies are provided at the module level and become available to
every component declared inside (or importing) that module:

```ts
// tasks.module.ts
@NgModule({
  declarations: [TasksComponent, TaskComponent, NewTaskComponent],
  exports: [TasksComponent],
  imports: [CommonModule, FormsModule, SharedModule]
})
export class TasksModule {}
```

`NewTaskComponent` uses `ngModel` in its template but never imports `FormsModule`
itself — it's available because `TasksModule` imports it. Same story for
`UserComponent`: it uses `<app-card>` but never imports `CardComponent` — it gets it
because `AppModule` imports `SharedModule`, which `exports: [CardComponent]`.

Dependencies are **module-scoped and implicit** — you have to look at the enclosing
module to know what a component's template can actually use.

## 4. Module hierarchy (modules project only)

```
AppModule
├─ declarations: AppComponent, UserComponent, HeaderComponent
├─ bootstrap: AppComponent
└─ imports: BrowserModule, SharedModule, TasksModule

SharedModule
├─ declarations: CardComponent
└─ exports: CardComponent        // so AppModule's components can use <app-card>

TasksModule
├─ declarations: TasksComponent, TaskComponent, NewTaskComponent
├─ exports: TasksComponent       // only what's used *outside* this module
└─ imports: CommonModule, FormsModule, SharedModule
```

Rules of thumb the annotations in `app.module.ts` / `tasks.module.ts` point out:

- `declarations` is for the components/directives/pipes a module **owns**.
- `exports` is for whatever other modules are allowed to use.
- `imports` is for pulling in other modules' exports (`BrowserModule`, `CommonModule`,
  `FormsModule`, or your own feature/shared modules).
- Only the **root** module sets `bootstrap`.
- `BrowserModule` (root only) already re-exports `CommonModule`, so feature modules
  like `TasksModule` import `CommonModule` directly instead (needed here for the
  `date` pipe in `task.component.html`).
- It's common to group cross-cutting, reusable components (like `CardComponent`) into
  their own `SharedModule`.

There is no equivalent hierarchy file in the standalone project — composition happens
directly through each component's `imports` array, and any "shared module" concept
would just be a plain TypeScript file exporting an array of components if you wanted
to group imports for convenience.

## 5. Practical consequences

| Aspect | Standalone | Modules |
|---|---|---|
| Boilerplate | Less — no module files | More — one `NgModule` per logical group |
| Where to find a component's deps | In the component itself | In the module that declares it |
| Refactoring / moving a component | Usually just move the file + fix its own imports | May need to update `declarations`/`exports` in multiple modules |
| Lazy loading | Per-component / route-based (`loadComponent`) | Per-module (`loadChildren`) |
| Learning curve | Simpler mental model (one file = one unit) | Extra indirection layer, but groups related things together |
| Angular's current direction | Recommended default since Angular 14+ (standalone), default in new projects since v17/19 | Still fully supported, common in existing/legacy codebases |

## 6. Takeaway

Standalone components collapse "what does this piece of the UI need" down to a single
file. NgModules add an extra grouping/encapsulation layer that can be useful for
organizing large apps (e.g. one module per feature, a `SharedModule` for reusable
pieces) but costs an extra level of indirection you have to keep in sync by hand. Both
projects prove the two approaches are functionally interchangeable for the same app —
the choice is about how explicit vs. how grouped you want dependency management to be.
