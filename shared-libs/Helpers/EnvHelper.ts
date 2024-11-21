import { Constants } from "./Constants"

class EnvHelper {
  private static instance: EnvHelper;

  // Define an index signature for dynamic keys
  [key: string]: string;

  // Private constructor to prevent instantiation
  private constructor() {

  }

  // Get the singleton instance
  public static getInstance(): EnvHelper {
    if (!EnvHelper.instance) {
      EnvHelper.instance = new EnvHelper();
    }
    return EnvHelper.instance;
  }
}

export { EnvHelper }
