import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import ShoppingsListsController from "./ShoppingLists/ShoppingListsController";
import ProductController from "./Products/ProductController";
import EventController from "./Events/EventController";
import ScannedItemsList from "./ScannedItems/ScannedItemsList";
import BrandController from "./Brands/BrandController";


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
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Shopping lists" />
          <Tab label="Product list" />
          <Tab label="Events" />
          <Tab label="Scanned items" />
          <Tab label="Brands" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ShoppingsListsController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProductController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EventController />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ScannedItemsList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <BrandController />
      </CustomTabPanel>
    </Box>
  );
}