"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { HydraAdmin, ResourceGuesser } from "@api-platform/admin";
import EventForm from "@/components/events/eventForm";
import Signin from "../signin/page";

const Admin = () => {
  const [DynamicAdmin, setDynamicAdmin] = useState(<p>Loading...</p>);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${window.origin}/docs`, {
          headers: { Accept: "application/ld+json" },
        });
        const data = await response.json();
        console.log(data["hydra:entrypoint"]);
      } catch (error) {
        console.error("Error fetching API docs:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setDynamicAdmin(
          <HydraAdmin entrypoint={window.origin}>
            <ResourceGuesser
              name="events"
              create={EventForm}
            />
            <ResourceGuesser name="users" 
            create={Signin}/>
            <ResourceGuesser name="user_events" />
            <ResourceGuesser name="user_invitations" />
          </HydraAdmin>
        );
      } catch (error) {
        console.error("Error setting DynamicAdmin:", error);
      }
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