import PropTypes from "prop-types"
// next
import NextLink from "next/link"
// @mui
import { Box, Tooltip, Link, ListItemText } from "@mui/material"
// locales

//
import { StyledItem, StyledIcon, StyledDotIcon } from "./styles"
import Iconify from "@/components/iconify"
import { t } from "i18next"
import { useSelector } from "react-redux"

// ----------------------------------------------------------------------

NavItem.propTypes = {
  open: PropTypes.bool,
  active: PropTypes.bool,
  item: PropTypes.object,
  depth: PropTypes.number,
  isExternalLink: PropTypes.bool,
}

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  ...other
}) {
  const { global } = useSelector((state) => state.globalSettings)

  const {
    name,
    slug,
    icon,
    info,
    children,
    totalChildren,
    disabled,
    caption,
    roles,
  } = item

  const subItem = depth !== 1

  const renderContent = (
    <StyledItem
      depth={depth}
      active={active}
      disabled={disabled}
      caption={!!caption}
      {...other}
    >
      {!item.parent_id && icon && (
        <StyledIcon>
          <img
            src={`${global?.base_urls?.category_image_path}/${item.icon}`}
            alt={name}
            style={{ filter: "invert(1)" }}
            // Example for dynamic coloring
          />
        </StyledIcon>
      )}

      {subItem && (
        <StyledIcon>
          <StyledDotIcon active={active && subItem} />
        </StyledIcon>
      )}

      <ListItemText
        primary={`${t(name)}`}
        secondary={
          caption && (
            <Tooltip title={`${t(caption)}`} placement="top-start">
              <span>{`${t(caption)}`}</span>
            </Tooltip>
          )
        }
        primaryTypographyProps={{
          noWrap: true,
          component: "span",
          variant: active ? "subtitle2" : "body2",
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: "caption",
        }}
      />

      {info && (
        <Box component="span" sx={{ lineHeight: 0 }}>
          {info}
        </Box>
      )}

      {!!children && totalChildren > 0 && (
        <Iconify
          width={16}
          icon={
            open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"
          }
          sx={{ ml: 1, flexShrink: 0 }}
        />
      )}
    </StyledItem>
  )

  const renderItem = () => {
    // ExternalLink
    if (isExternalLink)
      return (
        <Link href={slug} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      )

    // Has child
    if (children) {
      return renderContent
    }

    // Default
    return <ListItemText underline="none">{renderContent}</ListItemText>
  }

  return renderItem()
}
