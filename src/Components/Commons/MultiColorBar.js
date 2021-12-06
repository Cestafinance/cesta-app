import {
    Fragment,
    useState
} from 'react';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(theme => ({
    barBlock: {
        height: '12px',
        position: "relative"
    },
    colorIndicator: {
        height: '10px',
        width: '10px',
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

    return <Fragment>
        <div className={classes.displayFlex}>
            {coins.map((coin, index) => {
                return <div key={index}
                            className={classes.barBlock + ' ' + (index === 0 ? classes.firstBlock : '') + ' ' + (index === (coins.length - 1) ? classes.lastBlock : '')}
                            style={{width: `${coin.percent}%`, background: coin.color}}>
                    <div className={classes.labelName}>
                        <span className={classes.colorIndicator}
                              style={{background: coin.color}}>&nbsp;&nbsp;&nbsp;&nbsp;</span> {coin.label} {coin.percent}%
                    </div>
                </div>
            })}
        </div>


    </Fragment>

}

export default MultiColorBar;