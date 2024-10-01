import { Pipe, PipeTransform } from '@angular/core';
import { User } from './components/employeeform/employeeform.component';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: User[], searchTerm: string): User[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm)
      );
    });
  }

}
