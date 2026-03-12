"use client";

import Page from "@/components/order/OrderPage";

const Received = () => {
  return (
    <>
      <Page endPoint="active_status=assigned" />
    </>
  );
};

export default Received;
