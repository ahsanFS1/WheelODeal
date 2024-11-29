import { google } from 'googleapis';

export class GoogleAnalyticsClient {
  private analytics;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "manager-marketer-x-com-524@intense-petal-427109-e2.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC3Geu3m/SYP0Cx\nYJOSgXxIIMJlJ/gx9fhoqrt/VAjTydJU59RvIISZwfDrReC8xps6O7L1PmPMnCOb\nV5aYqILITJeO2tKs/UQkvifD6yFby+ISzQQDvbuY+KnckeG55ugWrkHj0I4py4gC\nxQd2GWxYNNwjhoCr2kbFt5Z9TWz9SKXlnYERRr1Lzo65908sLNfOoMyjDiX5udEr\n1ChDctgIf8h8yPaRSzrPfNi/JVNxoZsTvM05lbgkfYTMZJU/9DKCAkhLKnVkt09f\nHlTn2zyhWee/DwJ9GQ+fL3hnY7I2pNxuA7nmjlprHA/yk4cwDY9A7hI+/+CQ5kX6\n5pDvP/XnAgMBAAECggEABwaPl4lRu/scAweu9z17Wf59IbSEPtEuqZV41vc6f3s2\n/tsGY7KJDqf1E+dSgEEpTkq2yyzhrMWGTZJGzQS/lT/wcM16AqPqgXO/wty6zZ2S\nccuRY94Gh2Vt3xtvNdrjp5B4JsL8hs4FzKq9Zo1Ygunu/c34vJ9bfSqriOiiTfWd\ni4afRCUTjdD0T7zAxfQLf3lCMFQSqfLRlRiQFva7hwg30v8P/jQaCinDZ7iQTsgu\nWourYYmVVqe4EhD3BgzAUooNGsQlGkPNbZh8sMe26J5LQnbL7SOf6JITFIFT7GIk\nHc4egK2Rd2YxlsY5b61apclT7G/QuwOOffUsBQKtQQKBgQD5BmOADs3spxOIpZR3\nhb5kbHNjowM8cNZVrwsiyqmzislFmsZvg5E5MtWD4Ok7Glmy46gkpev3dOr63Xbi\n3otqSGlasb4e7KUxJlElKK1OzXVjWkf+QzM+DJh9eaxVS0PEsysxHRJPMw1vDJDZ\ndE6Hs9y4f3ocLNqXPZmazQqkNQKBgQC8OtUAulxXRYb0ooe1+7oLUn2Y47b+XkCC\njfDxblFwuzpK50f991IByd/GMXHYEXZZYulvCYU31rFYV+IvFl6hv3bCN0s7Nkgs\nMjoWGWc94O/LttMgDwzwovKjYxZV0pnHpod3zn/lyvWNY7jQ95f419yCsmHzEVpB\nuWYB2zb9KwKBgQCGhOb25AhlEBPDOv6qWfrxMIxchFBZM/L0MixnzOZC8HOtP+B1\nmLK4HTetl68lmCRgOA46Tc7by7KrdTqlbuYMsbUHowA6oEbT+AjZc9G6wc3pr3k4\nZoClwhQVo8ZuBMxE0yw/yZ58Xe2h0T3l2agaMhTHLUV/NtOV41a4go5/CQKBgQCx\n0MYdzO+kxhqqicu4gBgN0By0TRI3FCTO8HYYLYYj/8serYRWB8jhxapu2ZDZdA2g\nfY9WBOFjkZ6xfTxADVrSZEQ1TvTz9+CQV9aFv/PHAfKmOI0T8QPhY53h+Z5E7xG1\nCL1a0aoDFAuKSRVz2yImww0eLpPXgqIICrOxtzwoRwKBgQDpMkZ3B9GsY5IQLzZs\nmNuvA8H+nLhYIklrFMQ18RTC19/nOKjtCFY7iwznBqBLSgmphMDzHA93Bjofwjv1\nFNU3iooOAHJsntW3pX8BgGbGZBzbr0h3YpBBFmbz3+4fVxla4lQZVATurzx/llEd\nPEBEVLCDDMqytCCbIh53fFAhtQ==\n-----END PRIVATE KEY-----\n",
        project_id: "intense-petal-427109-e2",
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    this.analytics = google.analytics({
      version: 'v4',
      auth
    });
  }

  async getMetrics(pageId: string, startDate: Date, endDate: Date) {
    try {
      const response = await this.analytics.data.ga.get({
        'ids': 'ga:' + pageId,
        'start-date': startDate.toISOString().split('T')[0],
        'end-date': endDate.toISOString().split('T')[0],
        'metrics': 'ga:users,ga:totalEvents',
        'dimensions': 'ga:eventCategory'
      });

      const data = response.data;
      return {
        visitors: parseInt(data.totalsForAllResults['ga:users']),
        spins: data.rows?.find(row => row[0] === 'spin')?.[1] || 0,
        conversions: data.rows?.find(row => row[0] === 'conversion')?.[1] || 0
      };
    } catch (error) {
      console.error('Error fetching GA metrics:', error);
      return {
        visitors: 0,
        spins: 0,
        conversions: 0
      };
    }
  }

  trackEvent(pageId: string, eventName: string) {
    // Implement GA4 event tracking
    gtag('event', eventName, {
      page_id: pageId
    });
  }
}