const { default: Iconify } = require("@/components/iconify");
// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
import SvgColor from '@/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {

  dashboard: icon('ic_dashboard'),
  settings: icon('mdi--boat'),
  requestdock: icon('solar--file-send-bold-duotone'),
  logbook: icon('solar--pen-new'),
  shoonersailboat: icon('game-icons--shooner-sailboat'),
  icons8buy: icon('icons8--buy'),
  download: icon('solar--download-square-bold-duotone'),
  transfer: icon('solar--square-transfer-horizontal-bold-duotone'),
};

const NAV_ITEMS = [
  {
    subheader: '',
    items: [
      {
        title: 'Home',
        icon: <Iconify icon="eva:home-fill" />,
        path: '/',
      },
      {
        title: 'Chợ Nổi Thu Mua',
        path: '#',
        icon: <Iconify icon="carbon:3d-cursor-alt" />,
        children: [
          { title: 'Chợ nổi trên biển', path: '/procurement-offshore-market' },
          { title: ' Tiếp thị thu mua trên biển', path: '/' },
        ],
      },
      {
        title: 'Chành Vận Chuyển Biển',
        path: '#',
        icon: <Iconify icon="carbon:3d-mpr-toggle" />,
        children: [
          { title: ' Chành nhận tải', path: PATH_AUTH.login },
          { title: 'Nhu cầu chuyển tải', path: PATH_AUTH.register },
        ],
      },
    ],
  },
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'Login iUU',
        path: '#',
        icon: ICONS.dashboard,
        children: [
          {
            title: 'Yêu Cầu Cập Cảng',
            path: PATH_PAGE.page403,
            icon: ICONS.requestdock,
          },
          {
            title: 'Nhật Ký Khai Thác',
            path: PATH_PAGE.page404,
            icon: ICONS.logbook,
          },
          {
            title: 'Quản Lý Tàu',
            path: PATH_PAGE.page500,
            icon: ICONS.transfer,
          },
          {
            title: 'NM Chế Biến Thủy Sản',
            path: PATH_PAGE.page500,
            icon: ICONS.shoonersailboat,
          },
        ],
      },
    ],
  },
];

export default NAV_ITEMS;