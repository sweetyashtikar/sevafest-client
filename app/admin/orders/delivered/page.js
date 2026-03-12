"use client";

import Page from "@/components/order/OrderPage";

const Delivered = () => {
  return (
    <>
      <Page endPoint="active_status=delivered" />
    </>
  );
};

export default Delivered;