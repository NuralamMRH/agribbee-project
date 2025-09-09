import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import logo from '../../../public/logo.png'
import { useSelector } from 'react-redux'
const DynamicFavicon = (props) => {
    const { global } = useSelector((state) => state.globalSettings)
    const businessLogo = global?.base_urls?.business_logo_url
    //`${global?.fav_icon_full_url}`
    return (
        <Head>
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href={`${businessLogo}/${global?.fav_icon}`}
            />
            <link rel="icon" href={`${logo}`} />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href={'/logo.png'}
            />
            <link rel="icon" type="image/png" sizes="16x16" href={`${logo}`} />
        </Head>
    )
}

DynamicFavicon.propTypes = {}

export default DynamicFavicon
