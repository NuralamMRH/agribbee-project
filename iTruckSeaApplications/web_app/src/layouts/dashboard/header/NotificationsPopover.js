import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import { socket } from 'src/api/socket';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from 'src/redux/slices/storedData';
import MainApi from 'src/api/MainApi';
import OrderRequestDialog from 'src/sections/@dashboard/notifications/order_request';
import { useAuthContext } from 'src/auth/useAuthContext';
import currentLang from 'src/locales/current-lang';
import { setGlobalSettings } from 'src/redux/slices/global';

// ----------------------------------------------------------------------

export default function NotificationsPopover({ color }) {
  const [openPopover, setOpenPopover] = useState(null);

  const [openNotificationDialog, setOpenNotificationDialog] = useState(null);
  const [notificationAction, setNotificationAction] = useState(null);

  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.storedData);
  const [newNotifications, setNewNotifications] = useState([]);

  const totalUnRead =
    notifications.length > 0 && notifications.filter((item) => item?.seen === false).length;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const { user } = useAuthContext();
  console.log('Notification prover user: ', user);

  const handleMarkAllAsRead = () => {
    // dispatch(setNotifications(
    //   notifications.map((notification) => ({
    //     ...notification,
    //     isUnRead: false,
    //   })))
    // );
  };

  useEffect(() => {
    async function fetchNotifications() {
      const fetchedNotify = await MainApi.get('/api/v1/me/logs');
      console.log('New notification:', fetchedNotify.data);
      dispatch(setNotifications(fetchedNotify.data));
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    console.log('notifications', notifications);
    socket.on('new_notification', (notification) => {
      console.log('Notification received:', notification);
      dispatch(setNotifications([notification, ...notifications]));
    });

    return () => {
      socket.off('new_notification');
    };
  }, [newNotifications]);

  useEffect(() => {
    setNewNotifications(notifications);
  }, [notifications]);

  const handleOpenNotificationDialog = (notification) => {
    if (notification.action === 'order_request') {
      setOpenPopover(null);
      setOpenNotificationDialog(true);
      setNotificationAction(notification);
    }
  };

  const handleCloseNotificationDialog = () => {
    setOpenNotificationDialog(false);
    setNotificationAction(null);
  };

  const getMainWebsiteConfig = async () => {
    const language = currentLang();
    // Fetch config data
    const configRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/config`, {
      method: 'GET',
      headers: {
        'X-software-id': 33571750,
        'X-server': 'server',
        'X-localization': language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    });

    if (!configRes.ok) {
      throw new Error(`Failed to fetch config data: ${configRes.statusText}`);
    }

    const config = await configRes.json();

    dispatch(setGlobalSettings(config));
  };

  useEffect(() => {
    // getMainWebsiteConfig();
  }, []);

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="success">
          <Iconify color={color || ''} icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {newNotifications.length > 0 &&
              newNotifications
                .slice(0, 2)
                .map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    handleOpenNotificationDialog={handleOpenNotificationDialog}
                  />
                ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {newNotifications.length > 0 &&
              newNotifications
                .slice(2, 5)
                .map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    handleOpenNotificationDialog={handleOpenNotificationDialog}
                  />
                ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>

      {notificationAction?.action === 'order_request' && (
        <OrderRequestDialog
          open={openNotificationDialog}
          onClose={handleCloseNotificationDialog}
          notificationData={notificationAction}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    avatar: PropTypes.node,
    action: PropTypes.string,
    name: PropTypes.string,
    seen: PropTypes.bool,
    message: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  handleOpenNotificationDialog: PropTypes.func,
};

function NotificationItem({ notification, handleOpenNotificationDialog }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.seen && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() => handleOpenNotificationDialog(notification)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.createdAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.name}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.message)}
      </Typography>
    </Typography>
  );

  if (notification.action === 'created') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }

  if (notification.action === 'order_request') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification.action === 'order_placed') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification.action === 'order_shipped') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (notification.action === 'mail') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (notification.action === 'chat_message') {
    return {
      avatar: <img alt={notification.name} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.name} src={notification.avatar} /> : null,
    title,
  };
}
