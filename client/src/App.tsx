import React, { SyntheticEvent, useEffect, useState } from "react";
import { IJob } from "./interfaces/Job";
import axios from "axios";
import { Socket, io } from "socket.io-client";

const App = (): JSX.Element => {
  const [emailCount, setEmailCount] = useState<string | number>("");
  const [sendingCount, setSendingCount] = useState<boolean>(false);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [socket, setSocket] = useState<Socket>();

  /**
   * Call GET request to fetch all the jobs from the server
   */
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await axios.get("http://localhost:3001/jobs");
      setJobs(response.data);
    };
    fetchJobs();
  }, []);

  /**
   * Initialize a connection with Socket.io
   * Retrieve jobs from Socket.io on JobUpdate event
   */
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("jobUpdate", (data: IJob) => {
      setJobs((prevJobs) => {
        const isExist = prevJobs.some((job) => job.id === data.id);
        if (isExist) {
          return prevJobs.map((job) => (job.id === data.id ? data : job));
        } else {
          return [...prevJobs, data];
        }
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  /**
   * Call POST request to send number of emails to the server
   */
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      setSendingCount(true);
      const response = await axios.post("http://localhost:3001/jobs", {
        count: emailCount,
      });

      if (response.status === 201) {
        setEmailCount("");
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    } finally {
      setSendingCount(false);
    }
  };

  return (
    <section className="min-vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-7">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">
                  Create jobs for sending emails
                </h4>

                <form
                  className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2"
                  onSubmit={handleSubmit}
                >
                  <div className="col-12">
                    <div className="form-outline">
                      <input
                        type="number"
                        id="form1"
                        className="form-control"
                        placeholder="Enter number of emails"
                        value={emailCount}
                        onChange={(e) => setEmailCount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </form>

                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Job ID</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job: IJob) => (
                        <tr key={job.id}>
                          <th scope="row">{job.id}</th>
                          <td>{job.jobId}</td>
                          <td>Sent {job.count} emails.</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={3}>
                          No Job Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
