"use client";

import Page from "@/components/order/OrderPage";

const Pending = () => {
  return (
    <>
      <Page endPoint="active_status=Order%20placed" />
    </>
  );
};

export default Pending;
