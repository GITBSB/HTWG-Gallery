import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles'
import RESTCalls from "../rest/RESTCalls";

const useStyles = makeStyles(theme => ({
  formControl: {
    marginBottom: theme.spacing(1),
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function CustomerSelect (){
  const classes = useStyles();
  const [company, setCompany] = React.useState('');
  const [companies, setCompanies] = React.useState(1);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    //setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  var selected = false;

  const handleChange = event => {
    selected = true;

    setCompany(event.target.value);

    // Hack to change the color of the outlined label. If you wouldnt do this, it would be blue instead of black
    let outLinedLabel = document.getElementById('demo-simple-select-outlined-label');
    //if(outLinedLabel !== undefined) {
    //  outLinedLabel.style.color = 'black';
    //}
  };

  function requestCompanies() {
    RESTCalls.requestCompanies()
      .then(successCallback, failureCallback);

    return <MenuItem>Loading..</MenuItem>;
  }

  const createMenus = () => {
    var ctr = 10;

    var result = companies.map(function(c) {
      ctr = ctr+10;

      return (
        <MenuItem value={ctr}>
          {c}
        </MenuItem>
      );
    });

    return result;
  };


  function failureCallback(e) {
    console.log("Error. while requesting comapnies: " + e);
  }

  function successCallback(response) {
    console.log("RESPONS EIST: " + response);
    setCompanies(response);
  }

  return(
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        {<InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {companies !== 1 ? "Firma" : "Loading.."}
        </InputLabel>}
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={company}
          onChange={handleChange}
          labelWidth={labelWidth}>

          {companies !== 1 ? createMenus() : requestCompanies()}

        </Select>
      </FormControl>
    </div>
  )
}
