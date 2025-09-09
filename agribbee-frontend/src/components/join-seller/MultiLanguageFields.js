import React, { useState } from "react";
import { languageLists } from "../navbar/second-navbar/custom-language/languageLists";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const MultiLanguageFields = () => {
  const [tabValue, seTabValue] = useState("");

  const handleTabChange = (event, newValue) => {
    seTabValue(newValue);
  };
  return (
    <TabContext value={tabValue}>
      <TabList onChange={handleTabChange}>
        {languageLists?.map((lan, index) => (
          <Tab
            label={`${lan.countryCode} Name`}
            value={`${lan.languageCode}-name`}
          />
        ))}
      </TabList>
      {languageLists?.map((lan, index) => (
        <TabPanel key={lan.languageCode} value={`${lan.languageCode}-name`}>
          {lan.countryCode}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default MultiLanguageFields;
