import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// config
import { PATH_AFTER_LOGIN } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

import { getServerSideProps } from '../index';

// ----------------------------------------------------------------------

export default function Index({ configData }) {
  const { pathname, replace, prefetch } = useRouter();

  // console.log('configData', configData);

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.root) {
      replace(PATH_AFTER_LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AFTER_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export { getServerSideProps };
