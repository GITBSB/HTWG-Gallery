import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from "@material-ui/core/FormControl/FormControl";
import Select from "@material-ui/core/Select/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function ChangeUserButton(changerUser) {

  const classes = useStyles();
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });

  const handleChange = name => event => {
    setState({
      ...state,
      [name]: event.target.value,
    });

    changerUser.handleChangeUser();
  };

  return(
    <FormControl className={classes.formControl}>
      <Select
        native
        value={state.age}
        onChange={handleChange('age')}
        inputProps={{
          name: 'age',
          id: 'age-native-simple',
        }}
      >
        <option value={10}>Diakoniestation_kirchheim_teck</option>
        <option value={20}>Chargecontrol</option>
      </Select>
    </FormControl>
  )

}