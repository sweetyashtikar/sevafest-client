"use client";

import Page from "@/components/order/OrderPage";

const Cancelled = () => {
  return (
    <>
      <Page endPoint="active_status=cancelled" />
    </>
  );
};

export default Cancelled;
