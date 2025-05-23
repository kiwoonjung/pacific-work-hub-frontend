// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  PFP: '/pfp',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
    msal: {
      signIn: `${ROOTS.AUTH}/msal/sign-in`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },

  /**
   * Pacific First Aid
   */

  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
  },

  // WAREHOUSE

  /**
   * Pacific Fresh Produce
   */

  pfp: {
    root: `${ROOTS.PFP}`,
    produce: {
      root: `${ROOTS.PFP}/produces`,
      list: `${ROOTS.PFP}/produces/list`,
      create: `${ROOTS.PFP}/produces/create`,
      edit: (id: string) => `${ROOTS.PFP}/produces/edit/${id}`,
    },

    receiving: {
      root: `${ROOTS.PFP}/receiving`,
      list: `${ROOTS.PFP}/receiving/list`,
      create: `${ROOTS.PFP}/receiving/create`,
    },

    inventory: {
      root: `${ROOTS.PFP}/inventory`,
      list: `${ROOTS.PFP}/inventory/list`,
      create: `${ROOTS.PFP}/inventory/create`,
    },

    shipping: {
      root: `${ROOTS.PFP}/shipping`,
      list: `${ROOTS.PFP}/shipping/list`,
      create: `${ROOTS.PFP}/shipping/create`,
    },

    contact: {
      root: `${ROOTS.PFP}/contact`,
      customer: {
        root: `${ROOTS.PFP}/contact/customer`,
        list: `${ROOTS.PFP}/contact/customer/list`,
        create: `${ROOTS.PFP}/contact/customer/create`,
      },
      client: {
        root: `${ROOTS.PFP}/contact/client`,
        list: `${ROOTS.PFP}/contact/client/list`,
        create: `${ROOTS.PFP}/contact/client/create`,
      },
    },
  },
};
