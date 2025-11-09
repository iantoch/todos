import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-wrapper',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './section-wrapper.html',
  styleUrl: './section-wrapper.scss',
})
export class SectionWrapper {
  title = input<string>('Simple ToDo app');
  buttonType = input<'add' | 'back' | null>(null);

  onClick = output<void>();

  handleClick(): void {
    this.onClick.emit();
  }
}
