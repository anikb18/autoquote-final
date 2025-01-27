import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/analytics/dealer");
  }, [navigate]);

  return null;
}
