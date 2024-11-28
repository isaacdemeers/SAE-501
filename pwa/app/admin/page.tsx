"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { HydraAdmin } from "@api-platform/admin";

const Admin = () => {
  const [DynamicAdmin, setDynamicAdmin] = useState(<p>Loading...</p>);
  useEffect(() => {
    (async () => {
      const response = await fetch(`${window.origin}/docs`, {
        headers: { Accept: "application/ld+json" },
      });
      const data = await response.json();
      console.log(data["hydra:entrypoint"]);
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      setDynamicAdmin(<HydraAdmin entrypoint={window.origin} />);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>API Platform Admin</title>
      </Head>
      {DynamicAdmin}
    </>
  );
};

export default Admin;
