import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from './../../models/task.model';

@Component({
  selector: 'app-tasks-item',
  templateUrl: './tasks-item.component.html',
  styleUrls: ['./tasks-item.component.scss'],
})
export class TasksItemComponent {
  // <app-task-item [task]="task" (done)="onDone($event)"
  @Input() task: Task;
  @Output() done = new EventEmitter<Task>();
  @Output() update = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
}
