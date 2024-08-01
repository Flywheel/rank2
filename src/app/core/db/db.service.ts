import { computed, inject, Injectable, signal } from '@angular/core';
import { MockdataService } from '../../../assets/data';
import { Contest } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  http = inject(HttpClient);

  hh = computed(() => {
    ('');
  });
}
