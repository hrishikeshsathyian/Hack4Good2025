"use client";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import axiosInstance from "@/utils/axiosInstance";
import { TopItem } from "@/utils/interfaces";

export default function GenerateReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(""); // Placeholder for AI response
  const [isAiLoading, setIsAiLoading] = useState(false);

  interface ReportData {
    [key: string]: {
      qty: number;
      value: number;
    };
  }

  const [data, setData] = useState<ReportData>({});
  const [topItems, setTopItems] = useState<TopItem[]>([]);

  async function fetchPieChartData() {
    try {
      const body = {
        start_date: new Date(startDate).toISOString().split("T")[0],
        end_date: new Date(endDate).toISOString().split("T")[0],
      };
      const response = await axiosInstance.post("/breakdown", body);
      const responseData = await response.data;
      setData(responseData);
      const topItemsResponse = await axiosInstance.post("/top_items", body);
      const topItemsData = await topItemsResponse.data;
      setTopItems(topItemsData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  }

  console.log(Object.keys(data).map((key) => data[key].qty));
  const pieData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.keys(data).map((key) => data[key].qty),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const handleGenerateReport = () => {
    fetchPieChartData();
    setReportGenerated(true);
  };

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    setReportGenerated(false); // Allow regenerating the report on date change
  };

  const handleUserQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuestion(event.target.value);
  };

  const handleAskAi = async () => {
    setIsAiLoading(true);
    const body = {
      start_date: new Date(startDate).toISOString().split("T")[0],
      end_date: new Date(endDate).toISOString().split("T")[0],
      query: userQuestion,
    };
    const response = await axiosInstance.post("/generate_ai", body);
    const responseData = await response.data;
    setIsAiLoading(false);
    setAiResponse(responseData); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl text-black font-bold mb-6">Generate Report</h1>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <div className="flex-1 mb-4 md:mb-0">
            <label htmlFor="start-date" className="block text-sm text-black font-medium text-black-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="w-full border border-gray-300 text-black rounded-md p-2 focus:ring focus:ring-blue-200"
              value={startDate}
              onChange={handleDateChange(setStartDate)}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="end-date" className="block text-black text-sm font-medium text-black-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              className="w-full border border-gray-300 text-black rounded-md p-2 focus:ring focus:ring-blue-200"
              value={endDate}
              onChange={handleDateChange(setEndDate)}
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          disabled={!startDate || !endDate || reportGenerated}
        >
          Generate Report
        </button>

        {reportGenerated && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-black mb-4">Report Results</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-2 text-center">Category Breakdown</h3>
              <div className="flex justify-center items-center">
                <div style={{ width: "360px", height: "360px" }}>
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-2">In Demand Items 🔥</h3>
              <ul className="list-disc list-inside space-y-2">
                {Array.isArray(topItems) && topItems.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item.name} - {item.quantity} purchases
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-2">Ask AI Assistant</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ask the AI something..."
                  className="w-full border border-gray-300 text-black rounded-md p-2 focus:ring focus:ring-blue-200"
                  value={userQuestion}
                  onChange={handleUserQuestionChange}
                />
                <button
                  onClick={handleAskAi}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                  disabled={!userQuestion.trim()}
                >
                  Ask AI
                </button>
                {aiResponse && (
                  <div className="bg-gray-50 p-4 rounded-md shadow">
                    {isAiLoading && <p className="text-black-700">Loading AI Response...</p>}
                    {!isAiLoading && <p className="text-black-700">{aiResponse}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
