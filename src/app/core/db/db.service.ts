import { computed, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  http = inject(HttpClient);
  placeholder = computed(() => 'placeholder');
}
