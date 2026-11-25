export { smsService, createSmsService, VonageSmsProvider, BoundedDedupeMap, MAX_DEDUPE_ENTRIES } from './sms.service';
export {
  SmsTemplate,
  smsTemplateRegistry,
  SmsError,
  SmsSendError,
  SmsValidationError,
} from './sms.types';
export type {
  SmsPayload,
  SendOptions,
  SmsResult,
  ISmsProvider,
  SmsTemplateRegistry,
  SmsTemplateData,
} from './sms.types';
