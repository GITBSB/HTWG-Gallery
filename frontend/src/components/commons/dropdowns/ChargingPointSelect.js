import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from "@material-ui/core/FormControl/FormControl";
import Select from "@material-ui/core/Select/Select";
import InputLabel from '@material-ui/core/InputLabel'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function ChargingPointSelect({data, changePointCallback}) {

  const classes = useStyles();
  const dataA = data
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
    points: []
  });



  const handleChange = name => event => {
    setState({
      ...state,
      [name]: event.target.value,
    });

    changePointCallback(event.target.value);
  };

  return(
    <div>
    <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
        Ladepunkt auswählen
      </InputLabel>
      <Select
        native
        value={state.points == [] ? "No points" : state.points[0]}
        onChange={handleChange('age')}
        inputProps={{
          name: 'age',
          id: 'age-native-simple',
        }}
      >
        {
          dataA.map((point) => <option>{point}</option>)}
        }

      </Select>
    </FormControl>
    </div>
  )

}