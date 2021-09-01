import React, { useState } from "react";
import {
  Typography,
  Box,
  Toolbar,
  AppBar,
  TextField,
  Container,
  Card,
  CardContent,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const App = () => {
  const [twitterId, setTwitterId] = useState("");
  const [tweetCompTable, setTweetCompTable] = useState([
    { index: 0, tweet: "Tweetデータがありません", comp: "" },
  ]);
  const [errMsg, setErrMsg] = useState("");

  const useStyles = makeStyles({
    twitterIdForm: {
      marginTop: "40px",
      marginBottom: "40px",
    },
    submitBtn: {
      background: "#9ff",
      padding: "10px 30px",
      margin: "20px 0",
    },
    errMsg: {
      color: "#f00",
    },
    tableHeader: {
      background: "#3f51b5",
      color: "#fff",
    },
    thComp: {
      width: "30%",
      color: "#fff",
    },
    thTweet: {
      width: "70%",
      color: "#fff",
    },
    tableBody: {
      color: "#000",
    },
  });
  const classes = useStyles();

  const fetchTweet = () => {
    axios
      .get(`<APIのURL>?twitter_id=${twitterId}`)
      .then((res) => {
        const receivedTweetCompTable = JSON.parse(res.data.body).map((v, i) => {
          return { index: i, tweet: v[0], comp: v[1] };
        });
        setTweetCompTable(receivedTweetCompTable);
      })
      .catch((e) => {
        setErrMsg(e);
      });
  };

  const handleClick = () => {
    fetchTweet();
  };

  const handleTwitterId = (e) => {
    setTwitterId(e.target.value);
  };

  const submitBtn = (
    <Button
      disabled={twitterId.length <= 0}
      onClick={twitterId.length > 0 ? handleClick : null}
      classes={{
        root: classes.submitBtn,
      }}
    >
      最近の様子を確認する
    </Button>
  );

  const sentimentResults = (result) => {
    return {
      NEUTRAL: "中立的",
      POSITIVE: "肯定的",
      NEGATIVE: "否定的",
      MIXED: "混在",
    }[result];
  };

  return (
    <Container maxWidth="sm">
      <Box classes={{ root: classes.twitterIdForm }}>
        <AppBar position="static">
          <Toolbar>Twitter x Amazon Comprehend</Toolbar>
        </AppBar>
        <Card variant="outlined">
          <CardContent>
            <div>
              <TextField
                label="twitterId"
                onChange={handleTwitterId}
                value={twitterId}
              />
            </div>
            <div>{submitBtn}</div>
            <Typography
              variant="subtitle1"
              gutterBottom
              classes={{ root: classes.errMsg }}
            >
              {errMsg}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow classes={{ root: classes.tableHeader }}>
              <TableCell classes={{ root: classes.thComp }}>感情</TableCell>
              <TableCell classes={{ root: classes.thTweet }}>
                ツイート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tweetCompTable.map((data) => {
              return (
                <TableRow key={data.index.toString()}>
                  <TableCell classes={{ root: classes.tableBody }}>
                    {sentimentResults(data.comp)}
                  </TableCell>
                  <TableCell classes={{ root: classes.tableBody }}>
                    {data.tweet}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
