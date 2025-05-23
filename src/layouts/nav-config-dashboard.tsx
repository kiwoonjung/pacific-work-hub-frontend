import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  notebook: icon('solar--notebook-bold'),
  import: icon('solar--import-bold'),
  export: icon('solar--export-bold'),
  box: icon('solar--box-bold'),
  contact: icon('ic--baseline-contact-page'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Pacific First Aid',
    items: [
      // {
      //   title: 'Admin',
      //   path: paths.admin.root,
      //   icon: ICONS.user,
      //   info: <Label>{CONFIG.appVersion}</Label>,
      // },
      // { title: 'Program', path: paths.dashboard.two, icon: ICONS.ecommerce },
      // { title: 'Marketing', path: paths.dashboard.three, icon: ICONS.analytics },
      // {
      //   title: 'Warehouse',
      //   path: paths.dashboard.three,
      //   icon: ICONS.analytics,
      //   children: [
      //     { title: 'AMCARE', path: paths.dashboard.group.root },
      //     { title: 'Amazon', path: paths.dashboard.group.five },
      //     { title: 'Shopify', path: paths.dashboard.group.six },
      //   ],
      // },
    ],
  },

  /**
   * Pacific Fresh Produce
   */
  {
    subheader: 'Pacific Fresh Produce',
    items: [
      {
        title: 'Produce',
        path: paths.pfp.produce.root,
        icon: ICONS.notebook,
        children: [
          {
            title: 'List',
            path: paths.pfp.produce.list,
          },
          {
            title: 'Create',
            path: paths.pfp.produce.create,
          },
        ],
      },
      {
        title: 'Receiving',
        path: paths.pfp.receiving.root,
        icon: ICONS.import,
        children: [
          {
            title: 'List',
            path: paths.pfp.receiving.list,
          },
          {
            title: 'Create',
            path: paths.pfp.receiving.create,
          },
        ],
      },
      {
        title: 'Inventory',
        path: paths.pfp.inventory.root,
        icon: ICONS.box,
        children: [
          {
            title: 'List',
            path: paths.pfp.inventory.list,
          },
          {
            title: 'Create',
            path: paths.pfp.inventory.create,
          },
        ],
      },
      {
        title: 'Shipping',
        path: paths.pfp.shipping.root,
        icon: ICONS.export,
        children: [
          {
            title: 'List',
            path: paths.pfp.shipping.list,
          },
          {
            title: 'Create',
            path: paths.pfp.shipping.create,
          },
        ],
      },
      {
        title: 'Contact',
        path: paths.pfp.contact.root,
        icon: ICONS.contact,
        children: [
          {
            title: 'Customer',
            path: paths.pfp.contact.customer.root,
            children: [
              {
                title: 'List',
                path: paths.pfp.contact.customer.list,
              },
              {
                title: 'Create',
                path: paths.pfp.contact.customer.create,
              },
            ],
          },
          {
            title: 'Client',
            path: paths.pfp.contact.customer.root,
            children: [
              {
                title: 'List',
                path: paths.pfp.contact.client.list,
              },
              {
                title: 'Create',
                path: paths.pfp.contact.client.create,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    subheader: 'Management',
    items: [],
  },
];

/**
 * Management
 */
// {
//   subheader: 'Pacific Fresh Produce',
//   items: [
//     {
//       title: 'Inventory',
//       path: paths.dashboard.group.root,
//       icon: ICONS.user,
//       children: [
//         { title: 'Four', path: paths.dashboard.group.root },
//         { title: 'Five', path: paths.dashboard.group.five },
//         { title: 'Six', path: paths.dashboard.group.six },
//       ],
//     },
//   ],
// },
