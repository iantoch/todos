import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
})
export class SectionHeader {
  readonly router = inject(Router);
  title = input<string>('Simple ToDo app');
  showAdd = input<boolean>(true);
  showBack = input<boolean>(false);

  addClick = output<void>();
  backClick = output<void>();

  onAddClick(): void {
    this.addClick.emit();
  }

  onBackClick(): void {
    this.backClick.emit();
    this.router.navigate(['/todos']);
  }
}
