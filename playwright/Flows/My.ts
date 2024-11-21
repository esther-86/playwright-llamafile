import { EnvHelper } from 'shared-libs/Helpers/EnvHelper';
import { Constants } from 'shared-libs/Helpers/Constants';
import { GeneralHelper } from 'shared-libs/Helpers/GeneralHelper';
import { TimerHelper } from 'shared-libs/Helpers/TimerHelper';

import { EmailHelper } from './../Helpers/EmailHelper';
import { PdfHelper } from './../Helpers/PdfHelper';
import { ApiHelper } from '../../shared-libs/Api/ApiHelper';

import { CommonFlows } from './CommonFlows';
import { AppFlows } from './AppFlows';

class My {
  private static instance: My;

  // Singleton instance creation
  private constructor() { }

  // Get the singleton instance
  public static getInstance(): My {
    if (!My.instance) {
      My.instance = new My();
    }
    return My.instance;
  }

  public TestInfo = undefined
  public IsFirstTestRun = true

  // Properties
  public readonly Env = EnvHelper.getInstance();

  public readonly Api = ApiHelper.getInstance();

  public readonly Constants = Constants;
  public readonly GeneralHelper = GeneralHelper;
  public readonly TimerHelper = TimerHelper;

  public readonly Email = EmailHelper;
  public readonly Pdf = PdfHelper;

  public readonly CommonFlows = CommonFlows;
  public readonly Lumos = AppFlows;
}

export default My.getInstance(); // Exporting the singleton instance
