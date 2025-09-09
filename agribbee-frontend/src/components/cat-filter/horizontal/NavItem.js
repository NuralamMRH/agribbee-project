import PropTypes from "prop-types"
import { forwardRef } from "react"
// next
import NextLink from "next/link"
// @mui
import { Box, Tooltip, ListItemText, Link } from "@mui/material"
// locales

// auth
//
import Iconify from "@/components/iconify"
import { StyledItem, StyledIcon } from "./styles"
import { t } from "i18next"

// ----------------------------------------------------------------------

const NavItem = forwardRef(
  ({ item, depth, open, active, isExternalLink, ...other }, ref) => {
    const { translate } = useLocales()

    const { name, path, icon, info, children, disabled, caption, roles } = item

    const subItem = depth !== 1

    const renderContent = (
      <StyledItem
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {icon && <StyledIcon>{icon}</StyledIcon>}

        <ListItemText
          primary={`${t(name)}`}
          primaryTypographyProps={{
            noWrap: true,
            component: "span",
            variant: active ? "subtitle2" : "body2",
          }}
        />

        {info && (
          <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
            {info}
          </Box>
        )}

        {caption && (
          <Tooltip title={`${translate(caption)}`} arrow>
            <Box component="span" sx={{ ml: 0.5, lineHeight: 0 }}>
              <Iconify icon="eva:info-outline" width={16} />
            </Box>
          </Tooltip>
        )}

        {!!children && (
          <Iconify
            icon={subItem ? "eva:chevron-right-fill" : "eva:chevron-down-fill"}
            width={16}
            sx={{ ml: 0.5, flexShrink: 0 }}
          />
        )}
      </StyledItem>
    )

    const renderItem = () => {
      // ExternalLink
      if (isExternalLink)
        return (
          <Link href={path} target="_blank" rel="noopener" underline="none">
            {renderContent}
          </Link>
        )

      // Default
      return (
        <Link component={NextLink} href={path} underline="none">
          {renderContent}
        </Link>
      )
    }

    return renderItem()
  }
)

NavItem.propTypes = {
  open: PropTypes.bool,
  active: PropTypes.bool,
  item: PropTypes.object,
  depth: PropTypes.number,
  isExternalLink: PropTypes.bool,
}

export default NavItem
