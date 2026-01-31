import PaymentCard from "@/components/cards/PaymentCard";
import { IPaymentHistory } from "@/lib/db/models/Payment";
import React from "react";

const PaymentContainer = ({ data }: { data: IPaymentHistory[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((payment: any) => (
        <PaymentCard key={payment._id} payment={payment} />
      ))}
    </div>
  );
};

export default PaymentContainer;
