// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  gavel: icon('ic_gavel'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  settings: icon('mdi--boat'),
  requestdock: icon('solar--file-send-bold-duotone'),
  logbook: icon('solar--pen-new'),
  shoonersailboat: icon('game-icons--shooner-sailboat'),
  icons8buy: icon('icons8--buy'),
  download: icon('solar--download-square-bold-duotone'),
  transfer: icon('solar--square-transfer-horizontal-bold-duotone'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      {
        title: 'Vessel Setting',
        path: PATH_DASHBOARD.vessel.new,
        icon: ICONS.settings,
        roles: ['admin', 'vip', 'vp'],
      },
      { title: 'Request to Dock', path: PATH_DASHBOARD.eCommerce.new, icon: ICONS.requestdock },
      { title: 'Fishing Logbook', path: PATH_DASHBOARD.eCommerce.new, icon: ICONS.logbook },
      {
        title: 'Chợ Nổi Listing',
        path: PATH_DASHBOARD.eCommerce.new,
        icon: ICONS.shoonersailboat,
        roles: ['admin'],
      },
      { title: 'Thu Mua Listing', path: PATH_DASHBOARD.eCommerce.new, icon: ICONS.cart },
      { title: 'Nhận Tải Listing', path: PATH_DASHBOARD.eCommerce.new, icon: ICONS.download },
      { title: 'Chuyển Tải Listing', path: PATH_DASHBOARD.eCommerce.new, icon: ICONS.transfer },
    ],
  },
];

export default navConfig;
