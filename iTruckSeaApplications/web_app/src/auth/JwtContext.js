import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import { setUser } from 'src/redux/slices/customer';
import { socket } from 'src/api/socket';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get('/api/v1/me');

        const user = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      socket.emit('register', state.user._id);
    }

    return () => {
      if (state.isAuthenticated && state.user) {
        socket.emit('logout', state.user._id);
      }
      socket.off('new_notification');
    };
  }, [state.isAuthenticated, state.user]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await axios.post('/api/v1/login', {
      email,
      password,
    });

    const { token, user, role } = response.data;

    setSession(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    console.log('user', token, user);

    // Register user in the socket server
    socket.emit('register', user?._id);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, phone, role, password, f_name, l_name) => {
    const response = await axios.post('/api/v1/register', {
      email,
      phone,
      role,
      password,
      f_name,
      l_name,
    });

    const { token, user, role: usrRole } = response.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', usrRole);

    useEffect(() => {
      if (state.isAuthenticated && state.user) {
        socket.emit('register', state.user._id);
      }

      return () => {
        if (state.isAuthenticated && state.user) {
          socket.emit('logout', state.user._id);
        }
        socket.off('new_notification');
      };
    }, [state.isAuthenticated, state.user]);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Notify the server about user logout
    socket.emit('logout', state.user?._id);

    dispatch({
      type: 'LOGOUT',
    });
  }, [state.user]);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
