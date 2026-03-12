"use client";

import Page from "@/components/order/OrderPage";

const Returned = () => {
  return (
    <>
      <Page endPoint="active_status=returned" />
    </>
  );
};

export default Returned;
