import { Injectable, NgZone } from '@angular/core';
import { ElectronService, MessageService } from '@core/services';
import { LogicService } from './logic.service';
import * as child from 'child_process';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  constructor(
    private readonly ltlService: LogicService,
    private readonly electronService: ElectronService,
    private readonly msg: MessageService,
    private readonly ngZone: NgZone
  ) {}

  async doNuSMVCheck(modelPath: string, ltl: string, nuSmvMode: string, nuSmvPath: string): Promise<void> {
    const tempPath: string = this.electronService.remote.app.getPath('temp');
    await this.electronService.fs.copyFile(modelPath, `${tempPath}modelRun.smv`, err => {
      if (!!err?.message) {
        this.msg.info(err?.message);
      }
    });

    await this.electronService.fs.appendFile(`${tempPath}modelRun.smv`, `\n${nuSmvMode} ${ltl}`, err => {
      if (!!err?.message) {
        this.msg.info(err?.message);
      }
    });

    child.exec(`${nuSmvPath} ${tempPath}modelRun.smv`, async (error, stdout, stderr) => {
      if (error) {
        console.error(error?.message);
        this.ngZone.run(() => {
          this.msg.info('');
          this.msg.dialog({
            data: {
              headline: 'NuSMV Error - Pleas Check the Term or set the NuSMV path!',
              text: error?.message,
            },
          });
        });
      } else {
        await this.electronService.fs.unlink(`${tempPath}modelRun.smv`, err => {
          if (!!err?.message) {
            this.ngZone.run(() => {
              this.msg.info(err?.message);
            });
          }
        });

        this.ngZone.run(() => {
          const str = stdout.split('\n').filter(row => !row.includes('***') && row?.length > 0);
          if (str?.length <= 0) {
            str.push('NuSMV did not generate an output!');
            str.push('Please try again.');
          }

          this.msg.dialog(
            {
              data: {
                acceptButtonText: 'close and save as file',
                dismissButtonText: 'close and copy to clipboard',
                headline: 'NuSMV:',
                text: '',
                printObjects: [...str, ...stderr.split('\n')],
              },
            },
            {
              accept: () =>
                this.electronService.remote.dialog
                  .showSaveDialog({
                    filters: [{ name: 'text', extensions: ['txt'] }],
                  })
                  .then(async result => {
                    if (!result.canceled) {
                      await this.electronService.fs.writeFile(result.filePath, stdout, {}, err => {
                        if (!!err?.message) {
                          this.ngZone.run(() => {
                            this.msg.info(err?.message);
                          });
                        }
                      });
                    }
                  }),
              dismiss: () => this.electronService.clipboard.writeText(stdout),
            }
          );
        });
      }
    });
  }

  async doSpinCheck(modelPath: string, ltl: string, spinPath: string): Promise<void> {
    const tempPath: string = this.electronService.remote.app.getPath('temp');

    await this.electronService.fs.copyFile(modelPath, `${tempPath}modelRun.pml`, err => {
      if (!!err?.message) {
        this.msg.info(err?.message);
      }
    });

    await this.electronService.fs.appendFile(`${tempPath}modelRun.pml`, `\n\nltl p1 { ${ltl} }`, err => {
      if (!!err?.message) {
        this.msg.info(err?.message);
      }
    });

    child.exec(`${spinPath} -a ${tempPath}modelRun.pml`, { cwd: `${tempPath}` }, error => {
      if (error) {
        console.error(error?.message);
        this.ngZone.run(() => {
          this.msg.info('');
          this.msg.dialog({
            data: {
              headline: 'SPIN Error - Pleas Check the Term or set the SPIN path!',
              text: error?.message,
            },
          });
        });
      } else {
        child.exec(`gcc -o ${tempPath}pan pan.c`, { cwd: `${tempPath}` }, error => {
          if (error) {
            console.error(error?.message);
            this.ngZone.run(() => {
              this.msg.info('');
              this.msg.dialog({
                data: {
                  headline: 'SPIN/gcc Error - Pleas Check the Term or set the SPIN path!',
                  text: error?.message,
                },
              });
            });
          } else {
            let execString: string;
            if (this.electronService.remote.process.platform === 'win32') {
              execString = `${tempPath}pan -a -N p1  `;
            } else {
              execString = `${tempPath}pan -a -N p1`;
            }
            child.exec(execString, { cwd: `${tempPath}` }, (error, stdout, stderr) => {
              if (error) {
                console.error(error?.message);
                this.ngZone.run(() => {
                  this.msg.info('');
                  this.msg.dialog({
                    data: {
                      headline: 'SPIN/run Error - Pleas Check the Term or set the SPIN path!',
                      text: error?.message,
                    },
                  });
                });
              } else {
                this.ngZone.run(() => {
                  this.msg.dialog(
                    {
                      data: {
                        acceptButtonText: 'close and save trail as file',
                        dismissButtonText: 'close',
                        headline: 'SPIN:',
                        text: '',
                        printObjects: [...stdout.split('\n'), ...stderr.split('\n')],
                      },
                    },
                    {
                      accept: () =>
                        this.electronService.remote.dialog
                          .showSaveDialog({
                            filters: [{ name: 'SPIN', extensions: ['txt'] }],
                          })
                          .then(async result => {
                            this.electronService.clipboard.writeText(stdout);
                            if (!result.canceled) {
                              await this.electronService.fs.copyFile(
                                `${tempPath}modelRun.pml.trail`,
                                result.filePath,
                                err => {
                                  if (!!err?.message) {
                                    this.msg.info(err?.message);
                                  }
                                }
                              );
                              ``;
                              await this.electronService.fs.appendFile(
                                result.filePath,
                                `\nsee trail above.\n\nOutput: \n\n${stdout}`,
                                err => {
                                  if (!!err?.message) {
                                    this.msg.info(err?.message);
                                  }
                                }
                              );
                            }
                          }),
                      dismiss: () => this.electronService.clipboard.writeText(stdout),
                    }
                  );
                });
              }
            });
          }
        });
      }
    });
  }
}
