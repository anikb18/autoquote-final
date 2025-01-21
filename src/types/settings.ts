export interface BusinessSettings {
  businessName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  platformFee: number;
  dealerCommission: number;
  enableTradeIn: boolean;
  enableFinancing: boolean;
  notificationSettings: {
    newQuoteNotifications: boolean;
    dealerResponseNotifications: boolean;
    quoteExpiryHours: number;
    reminderTemplate: string;
  };
  dealershipRequirements: {
    requireLicense: boolean;
    requireInsurance: boolean;
    maxResponseTimeHours: number;
    minQuoteValidityDays: number;
  };
}