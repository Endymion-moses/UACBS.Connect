import { useEffect, useState } from "react";
import { LECTURER_REQUESTS } from "../services/appointmentServices";

const STORAGE_KEY = "uacbs-lecturer-requests";

const getSavedRequests = () => {
  const savedRequests = localStorage.getItem(STORAGE_KEY);

  if (!savedRequests) {
    return LECTURER_REQUESTS;
  }

  try {
    const parsedRequests = JSON.parse(savedRequests);
    const hasRequiredFields = parsedRequests.every((request) =>
      request.studentId && request.initials && request.topic
    );

    return hasRequiredFields ? parsedRequests : LECTURER_REQUESTS;
  } catch {
    return LECTURER_REQUESTS;
  }
};

export const useLecturerRequests = () => {
  const [requests, setRequests] = useState(getSavedRequests);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const updateRequestStatus = (id, status) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return {
    requests,
    updateRequestStatus,
  };
};

export default useLecturerRequests;
