import { makeStyles } from '@material-ui/core/styles'


//!useStyles
const useStyles = makeStyles((theme) =>({
    cardGrid:{
        paddingTop:'20px 0px'
    },
    card:{
        height:'100%',
        display:'flex',
        flexDirection:'column'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '300px',
    },
        '& .MuiButton-root': {
        margin: theme.spacing(2),
    },
    },
}))
export default useStyles