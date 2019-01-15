export class Logger {
  public static error(message: string, data?: object) {
    console.log(`Error: ${message}`);
    if (data) console.log(data);
  }

  public static info(message: string, data?: object) {
    console.log(`Info: ${message}`);
    if (data) console.log(data);
  }

  public static warning(message: string, data?: object) {
    console.log(`Warning: ${message}`);
    if (data) console.log(data);
  }

  public static success(message: string, data?: object) {
    console.log(`Success: ${message}`);
    if (data) console.log(data);
  }
}
