import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import ora from 'ora';
import process from 'process';

export async function spinnerText(
  message: string,
  fn: () => Promise</* eslint-disable  @typescript-eslint/no-explicit-any */ any>,
) {
  const spinner = ora(message).start();
  try {
    await fn();
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
}

/**
 * Execute a command and stream stdout and stderr to the parent process.
 * @param command The command to execute
 * @param options The options to pass to spawn
 * @returns The exit code of the command or an error if the command failed
 */
export async function execPipeOutput(
  command: string,
  options: SpawnOptionsWithoutStdio = {},
) {
  return new Promise((resolve, reject) => {
    // split the command into program and arguments
    const [program, ...args] = command.split(' ');
    const command_process = spawn(program, args, { shell: true, ...options });
    // Stream stdout to the parent process
    command_process.stdout.pipe(process.stdout);
    // Stream stderr to the parent process
    command_process.stderr.pipe(process.stderr);
    // Handle process completion
    command_process.on('close', (code) => {
      if (code === 0) {
        resolve(code); // Resolve if successful
      } else {
        reject(new Error(`Command failed with code ${code}`)); // Reject if there's an error
      }
    });
    // Handle errors in starting the process
    command_process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Execute a command and return the output as a Promise.
 * @param command The command to execute
 * @param options The options to pass to spawn
 * @returns The output of the command or an error if the command failed
 */
export async function execWithOutput(
  command: string,
  options: SpawnOptionsWithoutStdio = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    // split the command into program and arguments
    const [program, ...args] = command.split(' ');
    const command_process = spawn(program, args, { shell: true, ...options });
    let stdout = '';
    let stderr = '';
    // Stream stdout to the parent process and collect it
    command_process.stdout.on('data', (data) => {
      stdout += data;
    });
    // Stream stderr to the parent process and collect it
    command_process.stderr.on('data', (data) => {
      stderr += data;
    });
    // Handle process completion
    command_process.on('close', (code) => {
      if (code === 0) {
        // Combined stdout and stderr handling: If stdout is empty, return stderr as a fallback. This is important because some commands output critical information in stderr (like java -version).
        resolve(stdout.trim() || stderr.trim()); // Return stdout if available, otherwise stderr
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr.trim()}`)); // Include stderr in error
      }
    });
    // Handle errors in starting the process
    command_process.on('error', (error) => {
      reject(error);
    });
  });
}
