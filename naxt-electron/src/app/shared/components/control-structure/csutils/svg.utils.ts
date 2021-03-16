export class SVGUtils {
  /**
   * removes hover elements from svg and replaces spaces.
   */
  parseSvgToString(svg: SVGElement, isBlackWhite: boolean = false): string {
    // fit svg to content
    this.setSVGDimentions(svg);

    // make black and white
    if (isBlackWhite) {
      this.makeSVGBlackAndWhite(svg);
    }

    // delete hover elements
    this.clearSVGHoverElements(svg);

    // set opacity of arrows with a path
    this.setSVGOpacity(svg);

    const returnSVG: string = svg.outerHTML.replace(new RegExp('&nbsp;', 'g'), ' '); // replace spaces
    this.resetSVGElement(svg, isBlackWhite);
    return returnSVG;
  }

  /**
   * Sests the dimentions of the print svg
   */
  private setSVGDimentions(svg: SVGElement): void {
    const bb = (svg as any).getBBox();
    const bbx = bb.x;
    const bby = bb.y - 10;
    const bbw = bb.width;
    const bbh = bb.height + 20;
    const vb = [bbx, bby, bbw, bbh];
    svg.setAttribute('viewBox', vb.join(' '));
  }

  /**
   * delets the hover elements in the print svg
   */
  private clearSVGHoverElements(svg: SVGElement): void {
    Array.from(svg.getElementsByClassName('link-tools')).forEach((ele: SVGElement) => ele.parentNode.removeChild(ele));
    Array.from(svg.getElementsByClassName('marker-arrowheads')).forEach((ele: SVGElement) =>
      ele.parentNode.removeChild(ele)
    );
    Array.from(svg.getElementsByClassName('marker-vertices')).forEach((ele: SVGElement) =>
      ele.parentNode.removeChild(ele)
    );
  }

  private setSVGOpacity(svg: SVGElement): void {
    Array.from(svg.getElementsByClassName('joint-type-org-arrow')).forEach((ele: SVGElement) =>
      ele.setAttribute('fill-opacity', '0.0')
    );
    Array.from(svg.getElementsByClassName('marker-target')).forEach((ele: SVGElement) =>
      ele.setAttribute('fill-opacity', '1.0')
    );
    Array.from(svg.getElementsByClassName('label')).forEach((ele: SVGElement) =>
      ele.setAttribute('fill-opacity', '1.0')
    );
  }

  /**
   * changes colours to black and white and sets border stroke of boxes.
   */
  private makeSVGBlackAndWhite(svg: SVGElement): void {
    // stes arrow heads
    Array.from(svg.getElementsByClassName('marker-target')).forEach((ele: SVGElement) => {
      if (ele.getAttribute('fill') === '#ffc700') {
        ele.setAttribute('fill', 'black');
      } else {
        ele.setAttribute('fill', 'white');
      }
    });
    // sets border-stroke of Boxes
    Array.from(svg.getElementsByClassName('joint-type-xstampp-sensorshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.setAttribute('stroke-dasharray', '10,10');
        subEle.setAttribute('stroke', 'black');
      });
    });
    Array.from(svg.getElementsByClassName('joint-type-xstampp-actuatorshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.setAttribute('stroke', 'black');
      });
    });
    Array.from(svg.getElementsByClassName('joint-type-xstampp-processshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.setAttribute('stroke-dasharray', '10,2,2,2');
        subEle.setAttribute('stroke', 'black');
      });
    });
    Array.from(svg.getElementsByClassName('joint-type-xstampp-controllershape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        // subEle.setAttribute('stroke-dasharray', '10,2,2,2');
        subEle.setAttribute('fill', 'white'); // was white / green / PaleTurquoise
        subEle.setAttribute('stroke', 'black'); // was #3700FF
      });
      Array.from(ele.getElementsByTagName('text')).forEach((subEle: SVGTextElement) => {
        // console.log('set text');
        subEle.setAttribute('fill', 'black'); // was black / white / black
      });
    });
  }

  /**
   * resets the original svg
   */
  private resetSVGElement(svg: SVGElement, isBlackWhite: boolean): void {
    // resets border-stroke of Boxes
    Array.from(svg.getElementsByClassName('joint-type-xstampp-sensorshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.removeAttribute('stroke-dasharray');
        subEle.setAttribute('stroke', '#00ff00');
      });
    });
    Array.from(svg.getElementsByClassName('joint-type-xstampp-actuatorshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.setAttribute('stroke', '#ffc700');
      });
    });
    Array.from(svg.getElementsByClassName('joint-type-xstampp-processshape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement) => {
        subEle.removeAttribute('stroke-dasharray');
        subEle.setAttribute('stroke', '#8d0083');
      });
    });

    Array.from(svg.getElementsByClassName('joint-type-xstampp-controllershape')).forEach((ele: SVGElement) => {
      Array.from(ele.getElementsByTagName('rect')).forEach((subEle: SVGRectElement, index: number) => {
        switch (index) {
          case 0: {
            subEle.setAttribute('fill', 'white');
            break;
          }
          case 1: {
            subEle.setAttribute('fill', 'green');
            break;
          }
          case 2: {
            subEle.setAttribute('fill', 'PaleTurquoise');
            break;
          }
        }
        subEle.setAttribute('stroke', '#3700FF');
      });
      Array.from(ele.getElementsByTagName('text')).forEach((subEle: SVGTextElement, index: number) => {
        subEle.setAttribute('fill', index === 1 ? 'white' : 'black');
      });
    });
    // resets arrow heads
    if (isBlackWhite) {
      Array.from(svg.getElementsByClassName('marker-target')).forEach((ele: Element) => {
        if (ele.getAttribute('fill') === 'white') {
          ele.setAttribute('fill', '#00ff00');
        } else {
          ele.setAttribute('fill', '#ffc700');
        }
      });
    }
    // resets viewBox
    svg.removeAttribute('viewBox');
  }
}
