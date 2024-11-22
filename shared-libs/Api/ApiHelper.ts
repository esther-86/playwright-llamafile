import { EnvHelper } from '../Helpers/EnvHelper';
import { LMApi } from './LMApi';
const Env = EnvHelper.getInstance()

class ApiHelper {
  private static instance: ApiHelper;

  // Get the singleton instance
  public static getInstance(): ApiHelper {
    if (!ApiHelper.instance) {
      ApiHelper.instance = new ApiHelper();
    }
    return ApiHelper.instance;
  }

  public readonly LM = LMApi
}

export { ApiHelper }