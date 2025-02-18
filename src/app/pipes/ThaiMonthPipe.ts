import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiMonth',
  standalone: true
})
export class ThaiMonthPipe implements PipeTransform {
  private months: { [key: string]: string } = {
    'Jan': 'ม.ค.', 'Feb': 'ก.พ.', 'Mar': 'มี.ค.', 'Apr': 'เม.ย.', 
    'May': 'พ.ค.', 'Jun': 'มิ.ย.', 'Jul': 'ก.ค.', 'Aug': 'ส.ค.', 
    'Sep': 'ก.ย.', 'Oct': 'ต.ค.', 'Nov': 'พ.ย.', 'Dec': 'ธ.ค.'
  };

  transform(value: string | null | undefined): string {
    if (!value) return '-'; 

    
    const dateParts = value.split(' '); 
    if (dateParts.length < 3) return value;

    const day = dateParts[0];
    const month = this.months[dateParts[1]] || dateParts[1];
    const year = (parseInt(dateParts[2], 10) + 543).toString();

    return `${day} ${month} ${year}`;
  }
}
