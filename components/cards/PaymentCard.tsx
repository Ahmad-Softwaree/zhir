import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IPaymentHistory } from "@/lib/db/models/Payment";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";

interface PaymentCardProps {
  payment: IPaymentHistory;
}

const PaymentCard = ({ payment }: PaymentCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return (
          <Badge variant="default" className="bg-green-500">
            Succeeded
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            <CardTitle className="text-lg">
              ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
            </CardTitle>
          </div>
          {getStatusBadge(payment.status)}
        </div>
        <CardDescription className="text-xs">
          {formatDistanceToNow(new Date(payment.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {payment.description && (
          <p className="text-sm text-muted-foreground">{payment.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Transaction ID</span>
          <span className="font-mono">
            {payment.stripePaymentId?.slice(0, 16)}...
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
