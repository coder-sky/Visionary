

import React from "react"
import {
    Box,
    Typography,
    Grid2,
    Paper,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Button,
    Toolbar,
    Chip,
} from "@mui/material"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid2,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
import {
    TrendingUp,
    People,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    ShowChart,
    MoreVert,
    Person,
} from "@mui/icons-material"
import NavBar from "./NavBar"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,


} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend, PointElement, LineElement, ArcElement, ChartDataLabels
);

const dataBar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        label: 'Dataset 3',
        data: [18, 48, 77, 9, 100, 27, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        label: 'Dataset 4',
        data: [18, 48, 77, 9, 100, 27, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };
  
  const optionsBar = {
    responsive: true,
    
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Multi Dataset Bar Chart',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    
    },
  };
  

const piaOpt = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },

    },
}

const userActivityData = [
    { name: "Jan", users: 400, graphs: 240 },
    { name: "Feb", users: 300, graphs: 139 },
    { name: "Mar", users: 200, graphs: 980 },
    { name: "Apr", users: 278, graphs: 390 },
    { name: "May", users: 189, graphs: 480 },
    { name: "Jun", users: 239, graphs: 380 },
    { name: "Jul", users: 349, graphs: 430 },
]


export const options = {
    responsive: true,

    plugins: {
        datalabels: {
            display: false
        },
        legend: {
            position: 'bottom',
        },







    },

};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
export const piaData = {
    labels: ['Bar', 'Line', 'Pie',],
    datasets: [
        {

            data: [12, 19, 3,],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

export const data = {
    labels,
    datasets: [
        {
            label: 'Users',
            data: userActivityData.map(data => data.users),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',

            tension: 0.4,
        },
        {
            label: 'Graphs',
            data: userActivityData.map(data => data.graphs),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.4,
        },
    ],
};

// Sample data for charts


const chartTypeData = [
    { name: "Bar Charts", value: 400 },
    { name: "Line Charts", value: 300 },
    { name: "Pie Charts", value: 200 },
    { name: "Area Charts", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const topUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", graphsCreated: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", graphsCreated: 8 },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", graphsCreated: 5 },
]

const recentGraphs = [
    { id: 1, title: "Monthly Sales Analysis", type: "Bar Chart", creator: "John Doe" },
    { id: 2, title: "User Growth Trends", type: "Line Chart", creator: "Jane Smith" },
    { id: 3, title: "Revenue Distribution", type: "Pie Chart", creator: "Robert Johnson" },
]

export default function Dashboard() {
    return (
        <>
            <Box sx={{ display: 'flex', }}>
                <NavBar />
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                    <Grid2 container spacing={3} sx={{ mb: 4 }}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 140,
                                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                    color: "white",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography component="h2" variant="h6" gutterBottom>
                                        Total Users
                                    </Typography>
                                    <People />
                                </Box>
                                <Typography component="p" variant="h4">
                                    1,254
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    +12% from last month
                                </Typography>
                            </Paper>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 140,
                                    background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
                                    color: "white",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography component="h2" variant="h6" gutterBottom>
                                        Total Graphs
                                    </Typography>
                                    <BarChartIcon />
                                </Box>
                                <Typography component="p" variant="h4">
                                    3,782
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    +8% from last month
                                </Typography>
                            </Paper>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 140,
                                    background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                                    color: "white",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography component="h2" variant="h6" gutterBottom>
                                        New Users
                                    </Typography>
                                    <TrendingUp />
                                </Box>
                                <Typography component="p" variant="h4">
                                    192
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    This week
                                </Typography>
                            </Paper>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 140,
                                    background: "linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)",
                                    color: "white",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography component="h2" variant="h6" gutterBottom>
                                        New Graphs
                                    </Typography>
                                    <ShowChart />
                                </Box>
                                <Typography component="p" variant="h4">
                                    128
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    This week
                                </Typography>
                            </Paper>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 8 }}>

                            <Paper sx={{ height: { xs: 'auto', md: '350px' }, p: 2 }} elevation={5} >
                                <Typography mb={1}  component={'h3'} variant="p">User Activity & Graph Creation (Last 6 months) </Typography>
                                <Line options={options} data={data} />
                            </Paper>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 4 }}>

                            <Paper sx={{ height: { xs: 'auto', md: '350px' }, p: 2 }} elevation={5}>
                                <Typography mb={1}  component={'h3'} variant="p">Chart Types Distribution</Typography>
                                <Pie data={piaData} options={piaOpt} />

                            </Paper>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>

                            <Paper sx={{ height: { xs: 'auto', md: '350px' }, p:2 }} elevation={5}>
                                <Typography   component={'h3'} variant="p">Top Users by Graph Creation</Typography>
                                <List  >
                {topUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem >
                      <ListItemAvatar>
                        <Avatar sizes="small">
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={user.name} secondary={user.email} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {user.graphsCreated} graphs
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>

                            </Paper>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>

                            <Paper sx={{ height: { xs: 'auto', md: '350px' }, p: 2 }} elevation={5}>
                                <Typography mb={1} component={'h3'} variant="p">Recently Created Graphs </Typography>
                                <List>
                {recentGraphs.map((graph) => (
                  <React.Fragment key={graph.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              graph.type === "Bar Chart"
                                ? "#0088FE"
                                : graph.type === "Line Chart"
                                  ? "#00C49F"
                                  : graph.type === "Pie Chart"
                                    ? "#FFBB28"
                                    : "#FF8042",
                          }}
                        >
                          {graph.type === "Bar Chart" ? (
                            <BarChartIcon />
                          ) : graph.type === "Line Chart" ? (
                            <ShowChart />
                          ) : graph.type === "Pie Chart" ? (
                            <PieChartIcon />
                          ) : (
                            <BarChartIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={graph.title} secondary={`Created by ${graph.creator}`} />
                      <Box>
                        <Chip label={graph.type} >
                        
                        </Chip>
                        
                      </Box>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
                            </Paper>
                        </Grid2>
                        <Grid2 size={12}>
                        <Paper sx={{ height: 'auto', p: 2 }} elevation={5}>
                        <Typography mb={1} component={'h3'} variant="p">Monthly Graph Creation by Type (Last 6 Months) </Typography>
                            <Bar data={dataBar} options={optionsBar}  />
                            </Paper>

                        </Grid2>
                        </Grid2>
                </Box>

            </Box>






            {/* Stats Cards */}


        </>

    )
}

