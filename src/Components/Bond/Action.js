import { useState } from "react";
import { Box } from '@mui/material';
import Purchase from "./Purchase";
import { StyledTabs, StyledTab } from "../Invest/StrategyDetails";
import Redeem from "./Redeem";

function Tabs({
    onTabSelected
}) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabSelected = (value) => {
        setSelectedTab(Number(value))
        onTabSelected(Number(value));
    }

    return  <StyledTabs
        value={selectedTab}
        onChange={(event, newValue) => handleTabSelected(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
    >
        <StyledTab label="Bond"/>
        <StyledTab label="Redeem"/>
    </StyledTabs>
}

function Action ({
    bondData,
    onTabSelected
}) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabSelected = (event) => {
        setSelectedTab(event);
        onTabSelected(event);
    }

    return <Box sx={{padding: "16px"}}>
        <Tabs onTabSelected={handleTabSelected}/>
        {selectedTab===0 && <div style={{margin: "32px 0px"}}>
            <Purchase bondData={bondData}/>
        </div>}
        {selectedTab===1 && <div style={{margin: "32px 0px"}}>
            <Redeem bondData={bondData}/>
        </div>}
    </Box>;
}

export default Action;