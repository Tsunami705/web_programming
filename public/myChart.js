// This file is used to create the chart on the dashboard page
var wallPosts = 7;
var pageViews = 0;
var onlineUsers = 1;

function updateChart() {
  myBarChart.data.datasets[0].data = [wallPosts, pageViews, onlineUsers];
  myBarChart.update();
}

socket.on("chart", (data) => {
  // update chart data
  wallPosts = data.wallPosts;
  pageViews = data.pageViews;
  //onlineUsers = data.onlineUsers;
  updateChart();
});


socket.on("onlineUsers", (data) => {
  onlineUsers = data.onlineUsers;
  updateChart();
}); 


const ctx = document.getElementById("myChart");

myBarChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Wall Posts", "Page Views", "Online User"],
    datasets: [
      {
        label: "Values: ",
        data: [wallPosts, pageViews, onlineUsers],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    backgroundColor: "rgb(0, 0, 0)",
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 10,
  },
});