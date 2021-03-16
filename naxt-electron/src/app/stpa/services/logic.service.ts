import { Injectable } from '@angular/core';
import { ElectronService, MessageService } from '@core/services';
import { ProcessVariableTableEntry, UnsafeControlActionTableEntry } from '@stpa/src/main/services/models';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  errorString: string = '';
  variableDeleted: string = '';
  variableStateDeleted: string = '';
  ucaDeleted: string = '';

  constructor(
    private readonly msg: MessageService,
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService
  ) {
    translate
      .get(['LTL.ERROR', 'LTL.DELETED', 'LTL.STATEDEL', 'LTL:UCADEL'])
      .pipe(
        tap(res => {
          this.errorString = res['LTL.ERROR'];
          this.variableDeleted = res['LTL.DELETED'];
          this.variableStateDeleted = res['LTL.STATEDEL'];
          this.ucaDeleted = res['LTL.UCADEL'];
        })
      )
      .subscribe();
  }

  getNoHtml(value: string): string {
    return (
      value
        ?.replace(/[@#$§]/g, '')
        .replace(/<(?:.|\n)*?>/gm, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s\s+/g, ' ') ?? ''
    );
  }

  parseTerm(
    processVariables: ProcessVariableTableEntry[],
    value: string,
    ucaData: UnsafeControlActionTableEntry[],
    mode: 'regular' | 'nusmv' | 'promela' = 'regular',
    depth: number = 500
  ): string {
    // this.parsedTerm = this.getNoHtml(value);

    if (depth <= 0) throw new Error(this.errorString);

    let tempArr: string[] = this.getNoHtml(value).split(' ');
    processVariables?.forEach(variable => {
      tempArr = tempArr.map(entry => {
        if (entry.includes(variable.tableId)) {
          if (entry.includes('|name')) {
            switch (mode) {
              case 'nusmv':
                entry = variable?.nuSMVName?.length > 0 ? variable.nuSMVName : variable.name;
                break;
              case 'promela':
                entry = variable?.spinName?.length > 0 ? variable.spinName : variable.name;
                break;
              case 'regular':
                entry = variable.name;
                break;
            }
          } else if (entry.includes('|state')) {
            variable?.possibleVariableValues?.forEach(v => {
              if (entry.includes(v)) entry = v;
            });
          } else if (entry.includes('|value')) {
            try {
              entry = this.parseTerm(processVariables, variable.currentVariableValue, ucaData, mode, depth - 1);
            } catch (e) {
              throw e;
            }
          }
        }
        return entry;
      });
    });

    if (ucaData?.length > 0) {
      ucaData.forEach(uca => {
        tempArr = tempArr.map(entry => {
          if (entry.includes(uca.tableId)) {
            if (entry.includes('|uca')) entry = this.parseTerm(processVariables, uca.formal, ucaData, mode, depth - 1);
          }
          return entry;
        });
      });
    }

    const result = tempArr.join(' ');
    if (result.toLocaleLowerCase().includes('|value') || result.toLocaleLowerCase().includes('|name'))
      this.msg.info(this.variableDeleted);

    if (result.toLocaleLowerCase().includes('|state')) this.msg.info(this.variableStateDeleted);

    if (result.toLocaleLowerCase().includes('|uca')) this.msg.info(this.ucaDeleted);
    return result;
  }

  getNuSMV(
    processVariables: ProcessVariableTableEntry[],
    plain_ltl: string,
    ucaData?: UnsafeControlActionTableEntry[]
  ): string {
    const nuString: string = this.parseTerm(processVariables, plain_ltl, ucaData, 'nusmv')
      ?.replace(/&&/g, '&')
      .replace(/\|\|/g, '|')
      .replace(/%/g, 'mod')
      .replace(/==/g, '=')
      // .replace(/\s\s+/g, ' ') // replace with single space (not working?)
      .replace(/[^\x00-\x7F]/g, '')
      .trim();

    this.msg.info(nuString);

    this.electronService.clipboard.writeText(nuString);
    return nuString;
  }

  getPromela(
    processVariables: ProcessVariableTableEntry[],
    plain_ltl: string,
    ucaData?: UnsafeControlActionTableEntry[]
  ): string {
    const promelaString: string = this.parseTerm(processVariables, plain_ltl, ucaData, 'promela')
      .replace(/[^\x00-\x7F]/g, '')
      .trim();

    this.msg.info(promelaString);

    this.electronService.clipboard.writeText(promelaString);

    return promelaString;
  }
}
