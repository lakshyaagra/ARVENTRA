const http=require('http');
require("dotenv").config();
const emiReminderJob=require("./cron/emiReminderJob");
const { initializeSocket } = require("./socket/socket")
const { Server } = require("socket.io");
const { setIO } = require("./socket/socketEmitter");
const cors=require("cors")
const cookieParser = require("cookie-parser");

const {xss}=require('express-xss-sanitizer')

require("./cron/savingsRateAlertCron");
require("./cron/dailyAISmartNotificationCron");

const express = require("express");
const app = express();
const server=http.createServer(app);
const io=new Server(server,{
  cors: {
    origin: "http://localhost:5173", // Allow your frontend origin
    methods: ["GET", "POST"]
  }
});

initializeSocket(io);
setIO(io);

emiReminderJob();

app.use(express.json());
app.use(xss());
const connectDB=require('./config/db');
connectDB(); 

const helmet=require('helmet')
app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(cookieParser());

const sanitizeInput = require("./middleware/sanitizeInput");
app.use(sanitizeInput);

const goalsRouter=require('./routes/goals');
const usersRouter=require('./routes/users');
const loanRouter=require('./routes/loans');
const assetRouter=require('./routes/assets');
const expenseRouter=require('./routes/expense');
const incomeRouter=require('./routes/income');
const reportRouter=require('./routes/reports');
const creditHealthRouter=require('./routes/creditHealth')
const dashboardRouter=require('./routes/dashboard')
const calculatorRouter=require('./routes/calculators')
const discussionRouter=require('./routes/discussion')
const commentRouter=require('./routes/comment')
const likeRouter=require('./routes/like')
const notificationRouter=require('./routes/notification')
const settingsRouter=require('./routes/settings')
const contactRouter=require('./routes/contact')
const aiRouter=require('./routes/ai')


app.use("/users", usersRouter);
app.use("/goals", goalsRouter);
app.use("/loans",loanRouter);
app.use("/assets",assetRouter);
app.use("/expenses",expenseRouter);
app.use("/income", incomeRouter);
app.use("/reports",reportRouter);
app.use("/credit-health",creditHealthRouter);
app.use("/dashboard",dashboardRouter);
app.use("/calculators",calculatorRouter);
app.use("/community",discussionRouter);
app.use("/community", commentRouter);
app.use("/community", likeRouter);
app.use("/notifications", notificationRouter);
app.use("/settings",settingsRouter);
app.use("/contact",contactRouter);
app.use("/ai",aiRouter);


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to Financial OS Backend 🚀");
});

server.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});