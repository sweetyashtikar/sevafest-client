"use client";

import Page from "@/components/order/OrderPage";

const Shipped = () => {
  return (
    <>
      <Page endPoint="active_status=shipped" />
    </>
  );
};

export default Shipped;
