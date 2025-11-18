import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function RequireSuspension({ user, children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!user?.email) {
        setAllowed(false);
        return;
      }
      try {
        const res = await fetch(`${BACKEND}/api/users/profile/${user.email}`);
        if (!res.ok) throw new Error("profile fetch failed");
        const data = await res.json();
        const isSuspended = data.user?.[0]?.isSuspended;
        setAllowed(!!isSuspended);
      } catch (e) {
        console.error(e);
        setAllowed(false);
      }
    };
    run();
  }, [user]);

  if (allowed === null) {
    return <div style={{ padding: 24 }}>Checking permissions...</div>;
  }

  return allowed ? children : <Navigate to="/unauthorized" replace />;
}
