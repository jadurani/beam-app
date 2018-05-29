import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

/**
 * SmallSelectComponent
 *
 * Serves as an alternative to <select>.
 * Custom component contains an <input> and <ul> element
 * Accepts:
 *  - selectedChoice -- the initial value of the <input> element
 *  - choices -- populates the <ul> element
 *
 * Fires
 *  - selectAction -- sends the newly-selection option
 *  back to parent component
 *
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
