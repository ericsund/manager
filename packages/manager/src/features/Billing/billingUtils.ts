import { DateTime } from 'luxon';
import { AKAMAI_DATE } from 'src/constants';
import { TaxDetail } from 'src/featureFlags';
import { parseAPIDate } from 'src/utilities/date';

export const cleanCVV = (input: string): string => {
  // All characters except numbers
  const regex = /(([\D]))/g;

  // Prevents more than 4 characters from being submitted
  const cvv = input.slice(0, 4);
  return cvv.replace(regex, '');
};

export const getTaxID = (
  invoiceItemDate: string,
  taxDate?: string,
  country_tax?: TaxDetail
) => {
  if (!country_tax?.tax_id || !taxDate) {
    return undefined;
  }
  const taxStartedBeforeThisInvoiceItem =
    Date.parse(invoiceItemDate) > Date.parse(taxDate);
  return taxStartedBeforeThisInvoiceItem ? country_tax : undefined;
};

export const renderUnitPrice = (v: null | string) => {
  const parsedValue = parseFloat(`${v}`);
  return Number.isNaN(parsedValue) ? null : `$${parsedValue}`;
};

export const akamaiBillingInvoiceText =
  'Linode products and services will appear on your Akamai Technologies invoice.';

export const getShouldUseAkamaiBilling = (date: string) => {
  const invoiceDate = parseAPIDate(date);
  const akamaiDate = DateTime.fromSQL(AKAMAI_DATE);
  return invoiceDate > akamaiDate;
};
