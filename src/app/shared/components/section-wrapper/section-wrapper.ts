import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../section-header/section-header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-wrapper',
  imports: [CommonModule, SectionHeader],
  templateUrl: './section-wrapper.html',
  styleUrl: './section-wrapper.scss',
})
export class SectionWrapper {
  @Input() title?: string;

  constructor(private router: Router) {}

  onAdd(): void {
    this.router.navigate(['/todos/create']);
  }
}
