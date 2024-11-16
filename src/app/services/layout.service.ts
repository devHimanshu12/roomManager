import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isSmallDevice = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

  // common method to get isSmalldevice which be boolean
  getSmallDevice():boolean{
    this.checkBreakPoints()
    return this.isSmallDevice
  }

  updateSmallDevice(isSmallDevice:boolean){
    this.isSmallDevice = isSmallDevice;
  }

  checkBreakPoints() {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.updateSmallDevice(result.matches)
    });
  }


}
