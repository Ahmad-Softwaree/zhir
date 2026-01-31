import { getPayments } from "@/lib/actions/payment.action";
import NoData from "@/components/shared/NoData";
import { Coins } from "lucide-react";
import { getTranslations } from "next-intl/server";
import PaymentContainer from "@/container/payment/PaymentContainer";

const page = async () => {
  const t = await getTranslations("payment");
  const data = await getPayments();
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {data.length === 0 ? <NoData /> : <PaymentContainer data={data} />}
    </div>
  );
};

export default page;
