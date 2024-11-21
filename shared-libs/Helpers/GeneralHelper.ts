/* eslint-disable no-console */
import { add, sub } from 'date-fns';
import moment from 'moment-timezone';
/* eslint-disable no-console */
import { faker } from '@faker-js/faker';
import { EnvHelper } from './EnvHelper';
const Env = EnvHelper.getInstance()

class GeneralHelper {
  static getFaker() { return faker }
}

export { GeneralHelper }