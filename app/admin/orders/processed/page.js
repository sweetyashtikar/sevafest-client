"use client";

import Page from "@/components/order/OrderPage";

const Processed = () => {
  return (
    <>
      <Page endPoint="active_status=processed" />
    </>
  );
};

export default Processed;
