import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveType',
  standalone: true  
})
export class LeaveTypePipe implements PipeTransform {

  transform(value: string): string {
    const leaveTypeMap: { [key: string]: string } = {
      'ANNUAL_LEAVE': 'ลาพักร้อน',
      'SICK_LEAVE': 'ลาป่วย',
      'PERSONAL_LEAVE': 'ลากิจส่วนตัว',
    };

    return leaveTypeMap[value] || 'ไม่ทราบประเภทการลา';
  }
}
