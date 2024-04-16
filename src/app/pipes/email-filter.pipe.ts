import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailFilter',
})
export class EmailFilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    return items.filter(item => item.email.toLowerCase().includes(searchTerm));
  }
}
