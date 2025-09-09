import MainApi from '../../../api/MainApi'
import { useQuery } from 'react-query'

// export const landingPagedata = async () => {
//     const { data } = await MainApi.get('/api/v1/home-page-tabs')
//     return data
// }
export const pageTabsData = async () => {
    const language = localStorage.getItem('language')
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/home-page-tabs`,
        {
            method: 'GET',
            headers: {
                'X-software-id': 33571750,
                'X-server': 'server',
                'X-localization': language,
                origin: process.env.NEXT_CLIENT_HOST_URL,
            },
        }
    )

    // Parse the JSON data from the response
    const data = await response.json()

    // console.log('Data:', data)
    return data
}
export const useGetGreenBarTabs = (onSuccessHandler) => {
    return useQuery('landing_page_tabs', () => pageTabsData(), {
        onSuccess: onSuccessHandler,
        enabled: false,
    })
}
