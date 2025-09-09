import PropTypes from "prop-types"
// @mui
import { List, Stack } from "@mui/material"

import NavList from "./NavList"
import { t } from "i18next"

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
}

export default function NavSectionVertical({ data, sx, ...other }) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((list) => (
        <NavList
          key={list.name + list._id}
          data={list}
          depth={1}
          hasChild={!!list.children}
        />
      ))}
    </Stack>
  )
}
