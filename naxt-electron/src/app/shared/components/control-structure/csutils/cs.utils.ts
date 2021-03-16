import { ArrowAndBoxType } from '../cs.types';

export class CsUtils {
  /**
   * Checks if the Browser is Safari (doesn't support all jointJS features)
   */
  get isSafari(): boolean {
    return (
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') === -1 &&
      navigator.userAgent.indexOf('FxiOS') === -1
    );
  }

  /** checks if the browser is firefox
   * (firefox is the only browser, that calculates the layer position the right way);
   */
  get isFirefox(): boolean {
    return navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > -1;
  }

  breakText(text: string, maxLineLength: number): string {
    let newText = '';
    let lineLength: number = 0;
    text.split(' ').forEach((subText: string, i: number, arr: Array<string>) => {
      newText += subText;
      lineLength += subText.length;
      if (i !== arr.length - 1) {
        if (lineLength >= maxLineLength) {
          newText += '\n';
          lineLength = 0;
        } else {
          newText += ' ';
        }
      }
    });
    return newText;
  }

  unBreakText(text: string): string {
    return text.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  jointTypeToArrowAndBoxType(boxType: string): ArrowAndBoxType {
    let shape: string;
    shape = boxType.replace('xstampp.', '').replace('Shape', '');
    if (shape === 'Process') {
      shape = 'ControlledProcess';
    }
    return ArrowAndBoxType[shape];
  }

  /**
   * Checks if the placement of the arrow on a specific box is valid in STPA
   * @param arrowType: Type of the currently used arrow
   * @param boxType: Type of the box the user has dropped the arrow on
   * @param source: Is the current box the source of the arrow?
   */
  isValidPlacement(arrowType: ArrowAndBoxType, boxType: ArrowAndBoxType, source: boolean): boolean {
    /*
    TextBox and DashedBox don't represent entities and can't be source or target for an arrow
     */
    if (boxType === ArrowAndBoxType.TextBox || boxType === ArrowAndBoxType.DashedBox) {
      return false;
    }
    /*
    No arrow can point to an InputBox
     */
    if (boxType === ArrowAndBoxType.InputBox && !source) {
      return false;
    }
    /*
    No arrow can originate from an OutputBox
     */
    if (boxType === ArrowAndBoxType.OutputBox && source) {
      return false;
    }
    switch (arrowType) {
      case ArrowAndBoxType.ControlAction: {
        if (source) {
          return boxType === ArrowAndBoxType.Controller || boxType === ArrowAndBoxType.Actuator;
        } else {
          return (
            boxType === ArrowAndBoxType.Actuator ||
            boxType === ArrowAndBoxType.ControlledProcess ||
            boxType === ArrowAndBoxType.Controller
          );
        }
      }
      case ArrowAndBoxType.Feedback: {
        if (source) {
          return (
            boxType === ArrowAndBoxType.ControlledProcess ||
            boxType === ArrowAndBoxType.Sensor ||
            boxType === ArrowAndBoxType.Controller
          );
        } else {
          return boxType === ArrowAndBoxType.Controller || boxType === ArrowAndBoxType.Sensor;
        }
      }
      case ArrowAndBoxType.Input: {
        if (source) {
          return boxType === ArrowAndBoxType.InputBox;
        } else {
          return boxType !== ArrowAndBoxType.InputBox;
        }
      }
      case ArrowAndBoxType.Output: {
        if (source) {
          return boxType !== ArrowAndBoxType.OutputBox;
        } else {
          return boxType === ArrowAndBoxType.OutputBox;
        }
      }
    }
  }
}
