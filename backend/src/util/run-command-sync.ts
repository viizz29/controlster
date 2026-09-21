import {
  execSync,
  ExecSyncOptionsWithStringEncoding,
  spawn,
  execFileSync,
  ChildProcessWithoutNullStreams,
} from 'child_process';
import { isLinux } from './is-linux';

// const gitBashPath = `C:/Program Files/Git/bin/bash.exe`;

export function runCommandSync(
  command: string,
  { env, asUser }: { env?: any; asUser?: string | null } = {
    env: null,
    asUser: null,
  },
): void {
  const { BASH_ON_WINDOWS } = process.env;

  try {
    let params: ExecSyncOptionsWithStringEncoding = {
      encoding: 'utf8',
      stdio: 'inherit',
    };
    if (!isLinux()) {
      params = {
        ...params,
        shell: BASH_ON_WINDOWS,
      };
    }

    if (env) {
      params = {
        ...params,
        env,
      };
    }

    if (asUser) {
      execSync(`sudo -u ${asUser} ${command}`, params);
    } else {
      execSync(command, params);
    }
  } catch (error) {
    console.error(`Error executing command: ${(error as Error).message}`);
    throw error;
  }
}

export function runCommandWithPassword(
  command: string,
  args: string[],
  password: string,
  passwordPromptPattern: RegExp = /Password[:]?/i,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);

      // Look for password prompt
      if (passwordPromptPattern.test(output)) {
        // CustomLogger.i(`Putting password: ${password}`);
        child.stdin.write(password + '\n');
      }
    });

    child.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      process.stdout.write(errorOutput);

      // Check for password prompt in stderr too (some tools print there)
      if (passwordPromptPattern.test(errorOutput)) {
        // CustomLogger.i(`Putting password: ${password}`);
        child.stdin.write(password + '\n');
      }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export function runCommandSyncBash(command: string): void {
  try {
    execSync(command, {
      shell: '/bin/bash',
      encoding: 'utf8',
      stdio: 'inherit',
    });
  } catch (error) {
    console.error(`Error executing command: ${(error as Error).message}`);
    throw error;
  }
}

export const runShellScript = async (scriptPath: string) => {
  if (!scriptPath) return;

  try {
    execFileSync(scriptPath);
  } catch (error) {
    console.error(`Error executing shell script: ${(error as Error).message}`);
    throw error;
  }
};

export function runCommandAndGetResultAsString(command: string): string {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    return output.trim();
  } catch (error: any) {
    // If the command fails, capture stderr as well
    throw new Error(
      `Command failed: ${command}\n${error.stderr?.toString() || error.message}`,
    );
  }
}

export class ProcessRunHandler {
  private command: string;
  private args: string[];
  private child: ChildProcessWithoutNullStreams | null = null;

  public constructor(command: string, args: string[]) {
    this.command = command;
    this.args = args;
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { command, args } = this;
      const child = spawn(command, args, {
        detached: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      child.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output);
      });

      child.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        process.stderr.write(errorOutput);
      });

      child.on('close', (code) => {
        console.log('Process closed !');
      });

      child.on('error', (err) => {
        console.log('Error: ', err);
        reject();
      });

      child.on('spawn', () => {
        console.log('process spawned !');
        resolve();
      });

      this.child = child;
    });
  }

  public giveInput(input: string) {
    const { child } = this;
    if (!child) return;
    child.stdin.write(input + '\n');
  }

  public stop() {
    const { child } = this;
    if (!child) return;
    child.kill();
  }
}
