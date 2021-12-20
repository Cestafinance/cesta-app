import { Box } from "@mui/material";
import { Bond } from "../../helpers1/bond/bond";

interface IBondLogoProps {
    bond: Bond;
}

function BondLogo({ bond }: IBondLogoProps) {
    let style = { height: "32px", width: "32px" };

    if (bond.isLP) {
        style = { height: "30px", width: "62px" };
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
            <img src={bond.bondIconSvg} style={style} />
        </Box>
    );
}

export default BondLogo;
