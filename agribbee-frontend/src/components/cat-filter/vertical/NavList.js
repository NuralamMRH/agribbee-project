import PropTypes from "prop-types"
import { useState, useEffect } from "react"
// next
import { useRouter } from "next/router"
// @mui
import { Collapse } from "@mui/material"
//
import NavItem from "./NavItem"

// ----------------------------------------------------------------------

NavList.propTypes = {
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
}

export default function NavList({ data, depth, hasChild }) {
  const router = useRouter()
  const { category } = router.query

  const [active, setActive] = useState(category === data._id ? true : false)

  const [open, setOpen] = useState(active)

  useEffect(() => {
    if (!active) {
      handleClose()
    }

    if (category === data._id) {
      setActive(true)
    } else {
      setActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const handleRouterPush = (newFilters) => {
    const updatedQuery = {
      ...router.query,
      ...newFilters,
    }
    // Push the updated query and path
    router.push({
      query: updatedQuery,
    })
  }

  const handleToggle = () => {
    setOpen(!open)
    handleRouterPush({ category: data._id })
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={false}
        onClick={handleToggle}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
      )}
    </>
  )
}

// ----------------------------------------------------------------------

NavSubList.propTypes = {
  data: PropTypes.array,
  depth: PropTypes.number,
}

function NavSubList({ data, depth }) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.name + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
        />
      ))}
    </>
  )
}
