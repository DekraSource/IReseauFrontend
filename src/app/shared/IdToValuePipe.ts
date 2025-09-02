import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToValue'
})
export class IdToValuePipe implements PipeTransform {

  transform(id: number): string {
    // You can implement your logic here to map the ID to a value
    // For example, you might have a map of IDs to values
    const idValueMap: { [id: number]: string } = {
      1: 'Créée',
      2: 'En traitement',
      3: 'Résolue',
      4: 'Incomplète',
      5: 'Clôturée',
    };

    // Check if the ID exists in the map
    if (idValueMap[id]) {
      return idValueMap[id];
    } else {
      return 'Créée';
    }
  }
}
