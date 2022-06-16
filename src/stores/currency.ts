import { defineStore } from 'pinia';

const defaultCurrency = 'USD';
const defaultLocale = 'en';
const predefinedCurrencies = ['USD', 'GBP', 'SEK', 'EUR', 'JPY'];

function getLocaleFromCurrency(currency: string): string {
  let locale;
  /*
   * Since the user doesn't select a country you have to use a switch like this or map currencies to locales...
   * otherwise using a following implementation would be enough:
   * const language = navigator.language || navigator.languages[0];
   * return language ? language : defaultLocale;
   */
  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    case 'GBP':
      locale = 'en-GB';
      break;
    case 'SEK':
      locale = 'sv-SE';
      break;
    case 'EUR':
      locale = 'de-DE';
      break;
    case 'JPY':
      locale = 'ja-JP';
      break;
    default:
      locale = defaultLocale;
  }
  return locale;
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD',
  }),

  getters: {
    currencies(): string[] {
      return predefinedCurrencies;
    },
  },

  actions: {
    change(newCurrency: string) {
      this.$patch({
        currency: newCurrency,
      });
    },

    // Source: https://stackoverflow.com/a/53749034
    getCurrencySymbol(currency: string): string {
      try {
        const locale = getLocaleFromCurrency(currency);
        const symbol = (0)
          .toLocaleString(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          .replace(/\d/g, '')
          .trim();
        return symbol ? symbol : 'n/a';
      } catch {
        this.resetCurrency();
        return this.getCurrencySymbol(defaultCurrency);
      }
    },

    formatPrice(price: number): string {
      try {
        const locale = getLocaleFromCurrency(this.currency);
        const formatted = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: this.currency,
        }).format(price);
        return formatted
          ? formatted
          : price + this.getCurrencySymbol(this.currency);
      } catch {
        this.resetCurrency();
        return this.formatPrice(price);
      }
    },

    resetCurrency() {
      this.change(defaultCurrency);
    },
  },
});
