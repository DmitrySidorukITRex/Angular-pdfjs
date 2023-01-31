import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { COORDINATES, WORDS } from './app.constants';
import { AppHelper, Highlight } from './app.helper';
import { AddTagModalComponent } from './shared/add-tag-modal/add-tag-modal.component';

const ALL_COORDINATES = [
  {
    value: 'SCAC',
    coordinates: [
      323.09573591127105, 674.5034097721822, 345.9006833595624,
      665.570556055156,
    ],
  },
  {
    value: 'POR000380',
    coordinates: [
      455.0953986810552, 609.8016336930456, 498.4096199602818, 599.439523381295,
    ],
  },
  {
    value: '30183702',
    coordinates: [
      414.22200989208636, 730.875299760192, 476.483433272913, 714.7961630695445,
    ],
  },
  {
    value: 'Collect',
    coordinates: [
      361.15527577937655, 441.59041516786573, 388.5359554153553,
      432.65756145083935,
    ],
  },
  {
    value: '3rd Party X',
    coordinates: [
      395.87057853717033, 441.59041516786573, 441.04268509020915,
      432.65756145083935,
    ],
  },
];

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
    console.log('dragStart event---', event);

    const data = event.target.title;
    console.log('dragStart data---', data);
    event.dataTransfer.setData('data', data);
    event.dataTransfer.effectAllowed = 'move';
  }
  public onDrop(event: any) {
    console.log('onDrop event---', event);
    let dataTransfer = event.dataTransfer.getData('data');
    console.log('onDrop data---', dataTransfer);
    event.target.value = dataTransfer;
    event.preventDefault();
  }
  public allowDrop(event: any) {
    console.log('allowDrop event---', event);
    event.preventDefault();
  }

  public onDrop2(event: any) {
    console.log('onDrop event---', event);
    let dataTransfer = event.dataTransfer.getData('data');
    console.log('onDrop data---', dataTransfer);

    event.view.PDFViewerApplication.appConfig.viewerContainer
      .querySelectorAll('.pls-highlight')
      .forEach((e: any) => e.remove());

    this.currentHighlights = this.currentHighlights;

    // const newCoodrinates = [
    //   {
    //     value: 'SCAC',
    //     coordinates: [
    //       323.09573591127105, 674.5034097721822, 345.9006833595624,
    //       665.570556055156,
    //     ],
    //   },
    //   {
    //     value: 'POR000380',
    //     coordinates: [
    //       455.0953986810552, 609.8016336930456, 498.4096199602818,
    //       599.439523381295,
    //     ],
    //   },
    //   {
    //     value: '30183702',
    //     coordinates: [
    //       414.22200989208636, 730.875299760192, 476.483433272913,
    //       714.7961630695445,
    //     ],
    //   },
    //   {
    //     value: 'Collect 3rd Party X',
    //     coordinates: [
    //       361.15527577937655, 441.59041516786573, 441.04268509020915,
    //       432.65756145083935,
    //     ],
    //   },
    // ];
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

    // Get application instance
    const viewer = (event.view as any).PDFViewerApplication;

    //Get selected text
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
      const btn = document.createElement('button');

      wrapper.className = 'pls-wrapper';
      wrapper.setAttribute(
        'style',
        'position: absolute; z-index:1; display: flex;' +
          'left:' +
          Math.min(bounds[0], bounds[2]) +
          'px; top:' +
          Math.min(bounds[1], bounds[3]) +
          'px; width:' +
          (Math.abs(bounds[0] - bounds[2]) + 85) +
          'px;'
      );

      el.className = 'pls-highlight';
      el.setAttribute(
        'style',
        'border: 1px solid red; background-color: yellow; opacity: 0.5;' +
          'width:' +
          Math.abs(bounds[0] - bounds[2]) +
          'px; height:' +
          Math.abs(bounds[1] - bounds[3]) +
          'px;'
      );
      // el.setAttribute(
      //   'style',
      //   'position: absolute; z-index:1; background-color: yellow; opacity: 1;' +
      //     'left:' +
      //     Math.min(bounds[0], bounds[2]) +
      //     'px; top:' +
      //     Math.min(bounds[1], bounds[3]) +
      //     'px;' +
      //     'width:' +
      //     Math.abs(bounds[0] - bounds[2]) +
      //     'px; height:' +
      //     Math.abs(bounds[1] - bounds[3]) +
      //     'px;'
      // );
      el.setAttribute('draggable', 'true');
      el.title = rect.value;

      btn.className = 'pls-add-tag-btn';
      btn.innerText = 'Add Tag';
      btn.setAttribute(
        'style',
        'display: none; height: 20px; padding: 0 5px; margin-right: 8px;'
      );
      // btn.setAttribute(
      //   'style',
      //   'position: absolute; z-index:1; display: block;' +
      //     'left:' +
      //     (Math.min(bounds[0], bounds[2]) - 65) +
      //     'px; top:' +
      //     (Math.min(bounds[1], bounds[3]) - 5) +
      //     'px;' +
      //     'height: 20px'
      // );

      wrapper.addEventListener('mouseleave', (event: MouseEvent) => {
        // wrapper.style.left = Math.min(bounds[0], bounds[2]) + 'px';
        el.style.opacity = '0.5';
        // btn.style.display = 'none';
      });

      el.addEventListener('mouseover', (event: MouseEvent) => {
        // wrapper.style.left = Math.min(bounds[0], bounds[2]) - 80 + 'px';
        el.style.opacity = '0.5';
        el.style.cursor = 'move';
        // btn.style.display = 'block';
        // btn.style.cursor = 'pointer';
      });
      el.addEventListener('dragstart', this.onDragStart);
      // el.addEventListener('drop', this.onDrop2.bind(this));
      el.addEventListener('dragover', this.allowDrop);

      // btn.addEventListener('click', this.onAddTag.bind(this, el.title));

      // wrapper.appendChild(btn);
      wrapper.appendChild(el);
      pageElement.appendChild(wrapper);
    });
  }

  private onAddTag(value: string): void {
    const modalRef = this.modalService.open(AddTagModalComponent);
    modalRef.componentInstance.tagName = value;

    modalRef.result
      .then((value) => console.log(`Tag ${value} was saved!`))
      .catch((cancelReason) => console.log(`Cancel with ${cancelReason} msg!`));
  }
}
