import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Orders from "./OrderList";
import axios from "axios";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  caption: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0),
  },
  emptyPage: {
    height: theme.spacing(50),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

// Generate Order Data
function createData(id, date, productName, amount, status) {
  return { id, date, productName, amount, status };
}

export default function Dashboard(props) {
  const classes = useStyles();
  const [orders, setOrders] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const name = props.match.params.name;

  const fn = () => {
    async function fetchData() {
      if (!mounted) {
        const orders = await axios.get(
          `http://localhost:9000/orders/ordersWithName/${name}`
        );
        setOrders(orders.data.reverse());
        const rows = orders.data.map((order) =>
          createData(
            order.orderId,
            order.date,
            order.productName,
            order.amount,
            order.status
          )
        );
        setRows(rows);
        setMounted(true);
      }
    }
    fetchData();
  };

  React.useEffect(fn, []);

  // const rows = [
  //   createData(0, "16 Mar, 2019", "Arabica Beans", "40", "Pending"),
  //   createData(1, "16 Mar, 2019", "Excelsa Beans", "20", "Pending"),
  //   createData(2, "16 Mar, 2019", "Robusta beans", "25.5", "Confirmed"),
  //   createData(3, "16 Mar, 2019", "Liberica beans", "15", "Confirmed"),
  //   createData(4, "15 Mar, 2019", "Cat Poo Beans", "100", "Delivered"),
  // ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/*To enter name*/}
      <main className={classes.content}>
        <div className={classes.caption}>
          <Typography
            component="h4"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Hi {name}, here are your orders.
          </Typography>
        </div>
        <div className={classes.appBarSpacer} />
        {rows.length === 0 && (
          <Container Container className={classes.emptyPage} maxWidth="md">
            <Typography variant="h5">
              You have no postings available.
            </Typography>
            <SentimentVeryDissatisfiedIcon />
          </Container>
        )}
        {rows.length > 0 && (
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Orders rows={rows} />
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}></Box>
          </Container>
        )}
      </main>
    </div>
  );
}
