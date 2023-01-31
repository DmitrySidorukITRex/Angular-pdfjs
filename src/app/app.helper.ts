import { Injectable } from '@angular/core';

export interface ServerText {
  word: string;
  geo: number[][];
}

export interface Highlight {
  value: string;
  coordinates: number[];
}

@Injectable()
export class AppHelper {
  public getPixelsHighlights(
    serverTextList: ServerText[],
    width: number,
    height: number
  ): Highlight[] {
    if (!serverTextList) return [];

    let arr: Highlight[] = [];

    serverTextList.forEach((item) => {
      const coord = item.geo;
      const left = coord[0][0] * width;
      const top = coord[0][1] * height;
      const right = coord[1][0] * width;
      const bottom = coord[1][1] * height;

      const clientCoordinate = {
        value: item.word,
        coordinates: [left, top, right, bottom],
      };
      arr.push(clientCoordinate);
    });

    // for (let value in serverCoordinates) {
    //   const coord = serverCoordinates[value];
    //   const left = coord[0][0] * width;
    //   const top = coord[0][1] * height;
    //   const right = coord[1][0] * width;
    //   const bottom = coord[1][1] * height;

    //   const clientCoordinate = {
    //     value,
    //     coordinates: [left, top, right, bottom],
    //   };
    //   arr.push(clientCoordinate);
    // }

    return arr;
  }

  public getPDFPointsHighlights(
    highlights: Highlight[],
    viewport: any,
    pageRect: any
  ): Highlight[] {
    let pdfPointsHighlights = highlights;

    for (let i = 0; i < pdfPointsHighlights.length; i++) {
      const value = pdfPointsHighlights[i];
      const newCoord = viewport
        .convertToPdfPoint(value.coordinates[0], value.coordinates[1])
        .concat(
          viewport.convertToPdfPoint(value.coordinates[2], value.coordinates[3])
        );

      value.coordinates = newCoord;
    }

    return pdfPointsHighlights;
  }

  public getSelectedCoordinates(
    page: any,
    selection: Selection | null,
    textValue: string
  ): Highlight[] {
    if (!selection) return [];

    const pageRect = page.canvas.getClientRects()[0];
    const selectionRects = selection.getRangeAt(0).getClientRects();
    const viewport = page.viewport;

    const selectedCoords = [];
    for (let i = 0; i < selectionRects.length; i++) {
      const value: DOMRect = selectionRects[i];
      const newCoord = viewport
        .convertToPdfPoint(value.left - pageRect.x, value.top - pageRect.y)
        .concat(
          viewport.convertToPdfPoint(
            value.right - pageRect.x,
            value.bottom - pageRect.y
          )
        );

      selectedCoords.push({ value: textValue, coordinates: newCoord });
    }

    return selectedCoords;
  }
}
