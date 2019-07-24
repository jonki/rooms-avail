import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Paper
} from "@material-ui/core";

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

  const searchCallback = useCallback(handleSearch, [
    dateFrom,
    dateTo,
    setError,
    setIsLoading,
    setRoomsData,
    visitors
  ]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      // Run handle search when callback got new data
      searchCallback();
    }, 500);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchCallback]);

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
