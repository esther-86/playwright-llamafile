import { EnvHelper } from '../Helpers/EnvHelper';
import { QueriesApi } from './QueriesApi';
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

  public readonly Queries = QueriesApi
}

export { ApiHelper }