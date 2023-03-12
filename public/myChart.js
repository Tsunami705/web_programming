let wallPosts = 0;
let pageViews = 0;
let onlineUsers = 0;

const ctx = document.getElementById("myChart");

myBarChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Wall Posts", "Page Views", "Online User"],
    datasets: [
      {
        label: "# of Votes",
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

function updateChart() {
  myBarChart.data.datasets[0].data = [wallPosts, pageViews, onlineUsers];
  myBarChart.update();
}

socket.on("chart", (data) => {
  // update chart data
  wallPosts = data.wallPosts;
  pageViews = data.pageViews;
  updateChart();
});

socket.on("onlineUsers", (data) => {
  onlineUsers = data.onlineUsers;
  updateChart();
});
