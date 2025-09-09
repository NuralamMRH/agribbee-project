import React, { Fragment, Suspense } from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@mui/material";
import { Outlet } from "react-router-dom";
const ImportedFoodSourcing = (props) => {
  return (
    <Fragment>
      <main>
        <Suspense fallback={<LinearProgress />}>
          <Outlet />
        </Suspense>
      </main>
    </Fragment>
  );
};
ImportedFoodSourcing.propTypes = {
  route: PropTypes.object,
};

export default ImportedFoodSourcing;
