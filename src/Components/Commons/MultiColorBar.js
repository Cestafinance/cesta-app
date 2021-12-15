import {
    Fragment,
    useState
} from 'react';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(theme => ({
    barBlock: {
        height: '12px',
        position: "relative",
        "&:hover": {
            cursor: "pointer"
        }
    },
    colorIndicator: {
        height: '12px',
        width: '12px',
        borderRadius: '50%',
        display: 'inline-block'
    },
    labelName: {
        marginTop: '25px',
        textAlign: 'center',
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '12px',
        color: '#FFFFFF',
        display:"flex",
        alignItems:"center"
    },
    marginLeft16: {
        marginLeft: "16px"
    },
    displayFlex: {
        display: 'flex',
        width: "100%",
        alignItems: "stretch"
    },
    firstBlock: {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px'
    },
    lastBlock: {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px'
    }
}));

function MultiColorBar({
                           coins
                       }) {

    const classes = useStyles();
    let colors = ['#FFFFFF', '#8247E5', '#F7931A', '#26A17B', '#E84142']

    const openLink = (link) => {
        window.open(
            link,
            '_blank'
        )
    }

    return <Fragment>
        <div className={classes.displayFlex}>
            {coins.map((coin, index) => {
                return <div key={index}
                            className={classes.barBlock + ' ' + (index === 0 ? classes.firstBlock : '') + ' ' + (index === (coins.length - 1) ? classes.lastBlock : '')}
                            style={{width: `${coin.percent}%`, background: coin.color}}
                            onClick={()=>openLink(coin.link)}
                        >
                  
                </div>
            })}
           
        </div>
        <div style={{display:"flex", flexDirection:"row"}}>
            {coins.map((coin, index)=> {
                    return <div className={`${classes.labelName} ${index !== 0 ? classes.marginLeft16 : ""}`}>
                        <span className={classes.colorIndicator}style={{background: coin.color}}/>
                        <span style={{marginLeft: "8px"}}> {coin.label} {coin.percent}%</span>
                    </div>
            })}
        </div>
    </Fragment>

}

export default MultiColorBar;