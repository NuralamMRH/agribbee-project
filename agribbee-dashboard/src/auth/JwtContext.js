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
      // Check for token in URL parameters first (for cross-domain login)
      let tokenFromUrl = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        tokenFromUrl = params.get('token');
        
        if (tokenFromUrl) {
          // Store the token and clean the URL
          localStorage.setItem('accessToken', tokenFromUrl);
          localStorage.setItem('token', tokenFromUrl);
          localStorage.setItem('agribbeeUserToken', tokenFromUrl);
          setSession(tokenFromUrl);
          
          // Remove token from URL to avoid security issues
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      // Check for either token (from URL or localStorage)
      const accessToken = tokenFromUrl || 
                          localStorage.getItem('agribbeeUserToken') || 
                          localStorage.getItem('accessToken') || 
                          localStorage.getItem('token');

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
    // Set both tokens to ensure compatibility between apps
    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || 'user');

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
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/v1/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { token, user, role } = response.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

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
    localStorage.removeItem('agribbeeUserToken');
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
