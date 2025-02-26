/* eslint-disable react/prop-types */
import "./Dashboard.css";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DataContext } from "../../context/DataContext";
import { useContext } from "react";
import { AiOutlineReload } from "react-icons/ai";
import american_express from "../../assets/imgs/american_express.svg";
import discover_card from "../../assets/imgs/discover_card.svg";
import master_card from "../../assets/imgs/master_card.svg";
import avatar_3 from "../../assets/imgs/avatar-3.jpg";
import avatar_4 from "../../assets/imgs/avatar-4.jpg";
import avatar_5 from "../../assets/imgs/avatar-5.jpg";
import avatar_6 from "../../assets/imgs/avatar-6.jpg";
import avatar_7 from "../../assets/imgs/avatar-7.jpg";

const cardData = [
  {
    title: "Total Orders",
    value: "687.3k",
    subtext: "Since last month",
    percentage: 65,
    color: "#FF6B6B",
  },
  {
    title: "Total Revenue",
    value: "$5.42M",
    subtext: "Since last month",
    percentage: 32,
    color: "#00C49F",
  },
  {
    title: "New Users",
    value: "45.3k",
    subtext: "Since last month",
    percentage: 75,
    color: "#FFBB28",
  },
  {
    title: "Customer Satisfaction",
    value: "94.3%",
    subtext: "Since last month",
    percentage: 5.7,
    color: "#0088FE",
  },
];

const ordersData = [
  { name: "Direct", value: 48.5, color: "#8884d8" },
  { name: "Social", value: 33.6, color: "#82ca9d" },
  { name: "Marketing", value: 7.5, color: "#ff7300" },
  { name: "Affiliates", value: 10.4, color: "#ff6384" },
];

const revenueData = [
  { month: "Jan", income: 80, expense: 30 },
  { month: "Feb", income: 78, expense: 35 },
  { month: "Mar", income: 85, expense: 32 },
  { month: "Apr", income: 90, expense: 28 },
  { month: "May", income: 75, expense: 34 },
  { month: "Jun", income: 73, expense: 36 },
  { month: "Jul", income: 60, expense: 33 },
  { month: "Aug", income: 65, expense: 31 },
  { month: "Sep", income: 78, expense: 37 },
  { month: "Oct", income: 72, expense: 40 },
  { month: "Nov", income: 85, expense: 38 },
  { month: "Dec", income: 79, expense: 34 },
];

const statisticsData = [
  { year: "2019", value: 80 },
  { year: "2020", value: 100 },
  { year: "2021", value: 60 },
  { year: "2022", value: 110 },
  { year: "2023", value: 70 },
  { year: "2024", value: 90 },
  { year: "2025", value: 50 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0].payload; // Get data from payload

    return (
      <div
        style={{
          backgroundColor: color,
          color: "#fff",
          padding: "8px",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <strong>{name}</strong>: {value}%
      </div>
    );
  }
  return null;
};

const CustomTooltip2 = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#222",
          padding: "8px",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        <strong>{payload[0].payload.month}</strong>
        <div style={{ color: "#00C49F" }}>Income: {payload[0].value}</div>
        <div style={{ color: "#36A2EB" }}>Expenses: {payload[1].value}</div>
      </div>
    );
  }
  return null;
};

const profiles = [
  {
    name: "John Smith",
    role: "Project Manager",
    feedback: "80+ Feedbacks",
    image: avatar_3,
  },
  {
    name: "Jane Doe",
    role: "UI/UX Designer",
    feedback: "90+ Feedbacks",
    image: avatar_4,
  },
  {
    name: "Emily Brown",
    role: "Software Engineer",
    feedback: "100+ Feedbacks",
    image: avatar_5,
  },
  {
    name: "Mark Wilson",
    role: "Marketing Specialist",
    feedback: "70+ Feedbacks",
    image: avatar_6,
  },
  {
    name: "Sara Johnson",
    role: "Data Analyst",
    feedback: "50+ Feedbacks",
    image: avatar_7,
  },
];

export default function Dashboard() {
  const { isLightMode } = useContext(DataContext);
  return (
    <>
      <div className="container">
        <div className="dashboard">
          <div className="dashboard-container">
            {cardData.map((card, index) => (
              <div className="card" key={index}>
                <div className="card_header">
                  <h2>{card.title}</h2>
                  <i>
                    <BsThreeDotsVertical />
                  </i>
                </div>
                <div className="chart_container">
                  <ResponsiveContainer width={80} height={80}>
                    <PieChart>
                      <Pie
                        data={[
                          { value: card.percentage },
                          { value: 100 - card.percentage },
                        ]}
                        innerRadius={30}
                        outerRadius={40}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill={card.color} />
                        <Cell fill={isLightMode ? "#f5f6fa" : "#404954"} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    <span className="chart-text">{card.percentage}k</span>
                    <p className="value">{card.value}</p>
                    <p className="subtext">{card.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Statistics */}
          <div className="dashboard2-container">
            <div className="card">
              {/* Header with title and refresh button */}
              <div className="card_header">
                <h2>Orders Statistics</h2>
                <button className="refresh-button">
                  <span>Refresh</span>
                  <i>
                    <AiOutlineReload />
                  </i>
                </button>
              </div>

              {/* Pie Chart Container */}
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ordersData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {ordersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics (Bar Chart) */}
            <div className="card">
              <div className="card_header">
                <h2>Statistics</h2>
                <i>
                  <BsThreeDotsVertical />
                </i>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statisticsData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="year" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "#0d1b2a",
                      borderColor: "#177fcf",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#177fcf" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Total Revenue */}
            <div className="card">
              {/* Header */}
              <div className="card_header">
                <h2>Total Revenue</h2>
                <i>
                  <BsThreeDotsVertical />
                </i>
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip content={<CustomTooltip2 />} />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#36A2EB"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Payments - Expenses - Revenue Section */}
              <div className="revenue-footer">
                <div className="payments">
                  <h4>Payments</h4>
                  <div className="payment-icons">
                    <img src={american_express} alt="AMEX" />
                    <img src={discover_card} alt="Discover" />
                    <img src={master_card} alt="MasterCard" />
                  </div>
                </div>
                <div className="expenses">
                  <h4>Expenses</h4>
                  <span className="negative">$15.07k</span>
                </div>
                <div className="revenue">
                  <h4>Revenue</h4>
                  <span className="positive">$45.5k</span>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Cards */}
          <div className="profile-cards">
            {profiles.map((profile, index) => (
              <div className="profile-card" key={index}>
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="profile-img"
                />
                <div className="profile-info">
                  <h3 className="profile-name">{profile.name}</h3>
                  <p className="profile-role">{profile.role}</p>
                  <p className="profile-feedback">{profile.feedback} →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
