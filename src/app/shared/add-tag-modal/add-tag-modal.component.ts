import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.component.html',
  styleUrls: ['./add-tag-modal.component.scss'],
})
export class AddTagModalComponent {
  @Input() tagName: string;

  constructor(public activeModal: NgbActiveModal) {}

  public close(): void {
    this.activeModal.dismiss('Done');
  }

  public onSave(): void {
    this.activeModal.close(this.tagName);
  }
}
