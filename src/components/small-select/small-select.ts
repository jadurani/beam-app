import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

/**
 * Generated class for the SmallSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'small-select',
  templateUrl: 'small-select.html'
})
export class SmallSelectComponent {
  @Input() selectedChoice: string;
  @Input() choices: Array<string>;
  @Output() selectAction = new EventEmitter<string>();
  isMenuShown:boolean = false;

  constructor(private elemRef: ElementRef) {}

  onSelect(itemSelected: string) {
    this.selectedChoice = itemSelected;
    this.selectAction.emit(itemSelected);
    this.closeMenu();
  }

  openMenu() {
    this.isMenuShown = true;
  }

  closeMenu() {
    this.isMenuShown = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (!this.elemRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
