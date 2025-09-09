import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from 'firebase/messaging'

const firebaseConfig = {
    apiKey: '', // Add your API key here
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
}

let firebaseApp
let messaging = null

// Initialize Firebase only if apiKey is present
if (firebaseConfig.apiKey) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

    // Initialize messaging only if the browser supports it
    ;(async () => {
        try {
            const isSupportedBrowser = await isSupported()
            if (isSupportedBrowser) {
                messaging = getMessaging(firebaseApp)
            }
        } catch (err) {
            console.error('Error initializing messaging:', err)
        }
    })()
}

export const fetchToken = async (setTokenFound, setFcmToken) => {
    if (messaging) {
        return getToken(messaging, {
            vapidKey: '',
        })
            .then((currentToken) => {
                if (currentToken) {
                    setTokenFound(true)
                    setFcmToken(currentToken)
                    // Track the token -> client mapping, by sending to backend server
                    // show on the UI that permission is secured
                } else {
                    setTokenFound(false)
                    setFcmToken()
                    // show on the UI that permission is required
                }
            })
            .catch((err) => {
                console.error('Error fetching token:', err)
                // catch error while creating client token
            })
    } else {
        console.warn('Messaging is not initialized.')
        // handle case where messaging is not available
    }
}

export const onMessageListener = async () =>
    new Promise((resolve) => {
        ;(async () => {
            if (messaging) {
                onMessage(messaging, (payload) => {
                    resolve(payload)
                })
            } else {
                console.warn('Messaging is not initialized.')
                // handle case where messaging is not available
            }
        })()
    })
