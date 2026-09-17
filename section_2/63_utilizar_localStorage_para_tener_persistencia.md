task.service.ts
```typescript
import { Injectable } from '@angular/core';
import { type NewTaskData } from './task/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
    private tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary: 'Learn all the basic and advance feature of Angular and how to apply them.',
            dueDate: '2025-12-31'
        },
        // ...
    ];

    // traemos por primera vez los tasks guardados en localStorage si es que existen
    constructor() {
        const tasks = localStorage.getItem('tasks');

        if (tasks) {
            this.tasks = JSON.parse(tasks);
        }
    }

    getUserTasks(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    addTask(taskData: NewTaskData, userId: string) {
        this.tasks.unshift({
            id: new Date().getTime().toString(),
            userId: userId,
            title: taskData.title,
            summary: taskData.summary,
            dueDate: taskData.date
        });

        // llamamos cada vez que modificamos
        this.saveTasks();
    }

    removeTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id !== id);

        // llamamos cada vez que modificamos
        this.saveTasks();
    }

    // guardamos los tasks
    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

}
```
