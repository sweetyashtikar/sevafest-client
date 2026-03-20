"use client";

import Page from "@/components/order/OrderPage";

const Placed = () => {
  return (
    <>
      <Page endPoint="active_status=Order%20placed" />
    </>
  );
};

export default Placed;
