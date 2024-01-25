import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";

import ProductController from "./Products/ProductController";
import EventController from "./Events/EventController";
import BrandController from "./Brands/BrandController";
import CategoriesController from "./Categories/CategoriesController";
import ReceiptsController from "./Receipts/ReceiptsController/ReceiptsController";
import ScannedItemsController from "./ScannedItems/ScannedItemsController";
import BalanceInfo from "./Balance/BalanceInfo";


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

//   CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };

//   function a11yProps(index) {
//     return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//     };
//   }

export default function MainTabBar() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
          <Tab label="Bonnetjes" />
          <Tab label="Producten" />
          <Tab label="Events" />
          <Tab label="Gescand" />
          <Tab label="Brands" />
          <Tab label="Categorieën" />
          <Tab label="Balans" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ReceiptsController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProductController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EventController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ScannedItemsController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <BrandController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <CategoriesController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <BalanceInfo />
      </CustomTabPanel>
    </Box>
  );
}