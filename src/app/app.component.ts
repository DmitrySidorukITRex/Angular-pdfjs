import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { COORDINATES, WORDS } from './app.constants';
import { AppHelper, Highlight } from './app.helper';
import { AddTagModalComponent } from './shared/add-tag-modal/add-tag-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(PdfJsViewerComponent)
  public pdfJsViewerComponent: PdfJsViewerComponent;

  private currentHighlights: Highlight[] = [];

  constructor(private modalService: NgbModal, private appHelper: AppHelper) {}

  public onDragStart(event: any) {
    const data = event.target.title;

    event.dataTransfer.setData('data', data);
  }

  public onDrop(event: any) {
    let dataTransfer = event.dataTransfer.getData('data');

    event.target.value = dataTransfer;
    event.preventDefault();
  }

  public allowDrop(event: any) {
    event.preventDefault();
  }

  public mergeTags(event: any) {
    const dataTransfer = event.dataTransfer.getData('data');
    const targetData = event.target.title;

    event.view.PDFViewerApplication.appConfig.viewerContainer
      .querySelectorAll('.pls-highlight')
      .forEach((e: any) => e.remove());

    const transferedHighlight = this.currentHighlights.find(
      (x) => x.value === dataTransfer
    ) as Highlight;
    const transferedHighlightIndex = this.currentHighlights.findIndex(
      (x) => x.value === dataTransfer
    );
    let targetHighlight = this.currentHighlights.find(
      (x) => x.value === targetData
    ) as Highlight;

    const left = Math.min(
      transferedHighlight?.coordinates[0],
      targetHighlight?.coordinates[0]
    );
    const top = Math.min(
      transferedHighlight.coordinates[1],
      targetHighlight.coordinates[1]
    );
    const right = Math.max(
      transferedHighlight.coordinates[2],
      targetHighlight.coordinates[2]
    );
    const bottom = Math.max(
      transferedHighlight.coordinates[3],
      targetHighlight.coordinates[3]
    );

    targetHighlight = {
      value: `${dataTransfer} ${targetData}`,
      coordinates: [left, top, right, bottom],
    };

    this.currentHighlights.splice(transferedHighlightIndex, 1);
    this.currentHighlights[transferedHighlightIndex] = targetHighlight;

    this.onHighlightText(this.currentHighlights);

    event.preventDefault();
  }

  public testPagesLoaded(pagesNumber: number) {
    // this.pdfJsViewerComponent.PDFViewerApplication.appConfig.viewerContainer.onmouseup =
    //   this.onSelectText.bind(this);

    const viewer = this.pdfJsViewerComponent.PDFViewerApplication;
    const pageIndex = viewer.pdfViewer.currentPageNumber - 1;
    const page = viewer.pdfViewer.getPageView(pageIndex);
    const pageRect = page.canvas.getClientRects()[0];
    const viewport = page.viewport;

    const pixelsHighlights = this.appHelper.getPixelsHighlights(
      WORDS,
      page.width,
      page.height
    );

    const pdfPointsHighlights = this.appHelper.getPDFPointsHighlights(
      pixelsHighlights,
      viewport,
      pageRect
    );
    this.currentHighlights = pdfPointsHighlights;

    this.onHighlightText(pdfPointsHighlights);
  }

  private onHighlightText(selectedCoordinates: Highlight[]): void {
    const viewer = this.pdfJsViewerComponent.PDFViewerApplication;

    const pageIndex = viewer.pdfViewer.currentPageNumber - 1;
    const page = viewer.pdfViewer.getPageView(pageIndex);

    this.highlightSelectedText(page, selectedCoordinates);
  }

  private onSelectText(event: MouseEvent): void {
    if (!event.view) return;

    const viewer = (event.view as any).PDFViewerApplication;
    const content = event.view.getSelection()?.toString();

    if (content) {
      const pageIndex = viewer.pdfViewer.currentPageNumber - 1;
      const page = viewer.pdfViewer.getPageView(pageIndex);
      const selection = event.view.getSelection();
      const selectedCoordinates = this.appHelper.getSelectedCoordinates(
        page,
        selection,
        content
      );

      this.highlightSelectedText(page, selectedCoordinates);
    }
  }

  private highlightSelectedText(page: any, selectedCoords: Highlight[]): void {
    const pageElement = page.canvas.parentElement;
    const viewport = page.viewport;

    selectedCoords.forEach((rect) => {
      const bounds = viewport.convertToViewportRectangle(rect.coordinates);
      const wrapper = document.createElement('div');
      const el = document.createElement('div');
      const menulEl = this.getMenuEl(rect.value);

      wrapper.className = 'pls-wrapper';
      wrapper.setAttribute(
        'style',
        'position: absolute; display: flex;' +
          'left:' +
          Math.min(bounds[0], bounds[2]) +
          'px; top:' +
          Math.min(bounds[1], bounds[3]) +
          'px; width:' +
          Math.abs(bounds[0] - bounds[2]) +
          'px;'
      );

      el.className = 'pls-highlight';
      el.setAttribute(
        'style',
        'border: 1px solid red; background-color: yellow; opacity: 0; z-index: 1;' +
          'width:' +
          Math.abs(bounds[0] - bounds[2]) +
          'px; height:' +
          Math.abs(bounds[1] - bounds[3]) +
          'px;'
      );

      el.setAttribute('draggable', 'true');
      el.title = rect.value;

      wrapper.addEventListener('mouseleave', (event: MouseEvent) => {
        el.style.opacity = '0';
      });

      el.addEventListener('mouseover', (event: MouseEvent) => {
        el.style.opacity = '0.5';
        el.style.cursor = 'move';
      });
      el.addEventListener('click', (event: any) => {
        menulEl.style.display =
          menulEl.style.display === 'none' ? 'block' : 'none';
      });
      el.addEventListener('dragstart', this.onDragStart);
      el.addEventListener('drop', this.mergeTags.bind(this));
      el.addEventListener('dragover', this.allowDrop);

      wrapper.appendChild(menulEl);
      wrapper.appendChild(el);
      pageElement.appendChild(wrapper);
    });
  }

  private onAddTag(el: HTMLDivElement, value: string): void {
    const modalRef = this.modalService.open(AddTagModalComponent);
    modalRef.componentInstance.tagName = value;

    modalRef.result
      .then((value) => {
        console.log(`Tag ${value} was saved!`);
        el.style.display = 'none';
      })
      .catch((cancelReason) => console.log(`Cancel with ${cancelReason} msg!`));
  }

  private getMenuEl(text: string): HTMLDivElement {
    const menuEl = document.createElement('div');

    menuEl.setAttribute(
      'style',
      'width: 130px; position: absolute; top: 24px; right: 0; border: 1px solid #E5E5E5; display: none; box-sizing: border-box; background: #fff;'
    );

    const addTagItemEl = this.getMenuItemEl('Add Tag');
    const splitTagItemEl = this.getMenuItemEl('Split Tag');

    addTagItemEl.addEventListener(
      'click',
      this.onAddTag.bind(this, menuEl, text)
    );

    menuEl.appendChild(addTagItemEl);
    // menuEl.appendChild(splitTagItemEl);

    return menuEl;
  }

  private getMenuItemEl(title: string): HTMLDivElement {
    const menuEl = document.createElement('div');

    menuEl.innerText = title;
    menuEl.setAttribute(
      'style',
      'width: 100%; height: 40px; display: flex; align-items: center; justify-content: center; padding: 12px 16px; border-bottom: 1px solid #E5E5E5; background: #fff; cursor: pointer; z-index: 2; position: relative; box-sizing: border-box;'
    );

    menuEl.addEventListener('mouseenter', (event: MouseEvent) => {
      menuEl.style.backgroundColor = '#e5e5e5';
    });

    menuEl.addEventListener('mouseleave', (event: MouseEvent) => {
      menuEl.style.backgroundColor = '#fff';
    });

    return menuEl;
  }
}
