// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },

  {
    title: 'Services',
    path: '/pages',
    icon: <Iconify icon="eva:file-fill" />,
    children: [
      {
        subheader: 'Chợ Nổi Thu Mua',
        items: [
          { title: 'Chợ nổi trên biển', path: '/procurement-offshore-market' },
          { title: ' Tiếp thị thu mua trên biển', path: '/' },
        ],
      },
      {
        subheader: 'Chành Vận Chuyển Biển',
        items: [
          { title: ' Chành nhận tải', path: PATH_AUTH.login },
          { title: 'Nhu cầu chuyển tải', path: PATH_AUTH.register },
        ],
      },
      {
        subheader: 'Others',
        items: [
          { title: 'Yêu Cầu Cập Cảng', path: PATH_PAGE.page403 },
          { title: 'Nhật Ký Khai Thác', path: PATH_PAGE.page404 },
          { title: 'Quản Lý Tàu', path: PATH_PAGE.page500 },
          { title: 'NM Chế Biến Thủy Sản', path: PATH_PAGE.page500 },
        ],
      },
      {
        subheader: 'Dashboard',
        items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
      },
    ],
  },

  {
    title: 'Pages',
    path: '/pages',
    icon: <Iconify icon="eva:file-fill" />,
    children: [
      {
        subheader: 'Other',
        items: [
          { title: 'About us', path: PATH_PAGE.about },
          { title: 'Contact us', path: PATH_PAGE.contact },
          { title: 'FAQs', path: PATH_PAGE.faqs },
          { title: 'Pricing', path: PATH_PAGE.pricing },
          { title: 'Payment', path: PATH_PAGE.payment },
          { title: 'Maintenance', path: PATH_PAGE.maintenance },
          { title: 'Coming Soon', path: PATH_PAGE.comingSoon },
        ],
      },
      {
        subheader: 'Authentication',
        items: [
          { title: 'Login', path: PATH_AUTH.login },
          { title: 'Register', path: PATH_AUTH.register },
          { title: 'Reset password', path: PATH_AUTH.resetPassword },
          { title: 'Verify code', path: PATH_AUTH.verify },
        ],
      },
      {
        subheader: 'Error',
        items: [
          { title: 'Page 403', path: PATH_PAGE.page403 },
          { title: 'Page 404', path: PATH_PAGE.page404 },
          { title: 'Page 500', path: PATH_PAGE.page500 },
        ],
      },
      {
        subheader: 'Dashboard',
        items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
      },
    ],
  },
];

export default navConfig;
