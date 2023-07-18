import React, { SyntheticEvent, useEffect, useState } from "react";
import "./App.scss";
import { IJob } from "./interfaces/Job";
import axios from "axios";
import { io } from "socket.io-client";

const App = (): JSX.Element => {
  const [emailCount, setEmailCount] = useState<string | number>("");
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [socket, setSocket] = useState(null as any);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("jobUpdate", (data: any) => {
      setJobs((jobs: any) =>
        jobs.map((job: any) =>
          job.id === data.jobId
            ? { ...job, status: `Sent ${data.count} emails` }
            : job
        )
      );
    });

    const fetchJobs = async () => {
      const response = await axios.get("http://localhost:3001/jobs");
      setJobs(response.data);
    };

    fetchJobs();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/jobs", {
        count: emailCount,
      });

      if (response.status === 200) {
        console.log(`Job ID: ${response.data.jobId}`);
        // Also add the new job to the jobs array in state
        setJobs((jobs: any) => [
          ...jobs,
          { id: response.data.jobId, status: "Job created" },
        ]);
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={(e: SyntheticEvent) => handleSubmit(e)}>
        <input
          type="number"
          value={emailCount}
          onChange={(e) => setEmailCount(e.target.value)}
          placeholder="Number of emails"
          required
        />

        <button type="submit">Send Emails</button>
      </form>

      {/* {jobs.map((job) => (
        <p key={job.id}>
          Job {job.id}: {job.status}
        </p>
      ))} */}
    </div>
  );
};

export default App;
