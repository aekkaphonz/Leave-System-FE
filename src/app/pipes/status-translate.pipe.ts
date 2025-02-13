import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate',
  standalone: true  
})
export class StatusTranslatePipe implements PipeTransform {

  transform(value: string): string {
    const statusMapping: { [key: string]: string } = {
      PENDING: 'รอดำเนินการ',
      APPROVED: 'อนุมัติแล้ว',
      REJECTED: 'ถูกปฏิเสธ'
    };
    
    return statusMapping[value] || 'ไม่ทราบสถานะ';
  }
}
