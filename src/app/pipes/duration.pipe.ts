import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'durationRuntime', standalone: true })

export class DurationRuntimePipe implements PipeTransform {
  transform(value: number): string {
    const hours = (value / 60);
    const runtimeHours = Math.floor(hours);
    const minutes = (hours - runtimeHours) * 60;
    const runtimeMinutes = Math.round(minutes);
    return `${runtimeHours} hour ${runtimeMinutes} minute`
  }
}
