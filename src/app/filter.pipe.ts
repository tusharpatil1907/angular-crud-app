import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items:any[] , key:string,value: string ): unknown {
    if (!items || !key || !value) {
      return items;
    }
    console.log(items)

    return items.filter(item => item[key] === value);
  }

}