import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Paper
} from "@material-ui/core";
import debounce from "debounce";

import "./App.css";
import FormComponent from "./components/FormComponent";
import ListContainer from "./components/ListContainer";

import fetchRoomsData from "./utilities/fetchFunctions";

const useAppState = () => {
  const [visitors, setVisitors] = useState({
    adultsNumber: 1,
    childrenNumber: 0
  });

  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());

  const [roomsData, setRoomsData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setRoomsData(null);
    setIsLoading(true);

    fetchRoomsData(
      {
        dateFrom: dateFrom,
        dateTo: dateTo,
        visitors: visitors
      },
      (error, roomsData) => {
        setRoomsData(roomsData);
        setError(error);
        setIsLoading(false);
      }
    );
  };

  // useRef is required so debounced handleSearch will not be recreated on each render
  const debouncedSearch = useRef(debounce(handleSearch, 500));

  useEffect(() => {
    debouncedSearch.current();
  }, [
    dateFrom,
    dateTo,
    debouncedSearch,
    setError,
    setIsLoading,
    setRoomsData,
    visitors
  ]);

  const handleChangeVisitors = name => event => {
    setVisitors({ ...visitors, [name]: event.target.value });
  };
  const handleChangeDateFrom = date => {
    setDateFrom(date);
    if (date > dateTo) {
      setDateTo(date);
    }
  };
  const handleChangeDateTo = date => {
    setDateTo(date);
    if (date < dateFrom) {
      setDateFrom(date);
    }
  };

  return {
    isLoading,
    error,
    roomsData,
    handleSearch,
    handleChangeDateTo,
    handleChangeDateFrom,
    handleChangeVisitors,
    visitors,
    dateTo,
    dateFrom
  };
};

const App = () => {
  const {
    isLoading,
    error,
    roomsData,
    handleSearch,
    handleChangeDateTo,
    handleChangeDateFrom,
    handleChangeVisitors,
    visitors,
    dateTo,
    dateFrom
  } = useAppState();

  return (
    <Paper className="App">
      <Card>
        <CardContent>
          <Typography component="h4">
            Please choose dates and guest's information to see prices:
          </Typography>
          <FormComponent
            dateFrom={dateFrom}
            dateTo={dateTo}
            visitors={visitors}
            handleChangeVisitors={handleChangeVisitors}
            handleChangeDateFrom={handleChangeDateFrom}
            handleChangeDateTo={handleChangeDateTo}
          />
        </CardContent>
        <CardActions disableSpacing>
          <Button variant="outlined" onClick={handleSearch}>
            Search
          </Button>
        </CardActions>
      </Card>
      <ListContainer
        roomsData={roomsData}
        error={error}
        isLoading={isLoading}
      />
    </Paper>
  );
};

export default App;
