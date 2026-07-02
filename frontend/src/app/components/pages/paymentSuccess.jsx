import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { useUser } from "../../lib/userContext.jsx";
import { useLanguage } from "../../lib/languageContext.jsx";

export default function PaymentSuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useUser();
  const { t } = useLanguage();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(t("payment.verifying"));

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get("order_id");
        const token = localStorage.getItem("token");

        if (!orderId) {
          throw new Error(t("payment.order_missing"));
        }

        if (!token) {
          throw new Error(t("payment.token_missing"));
        }

        const response = await fetch(
          `http://localhost:3000/api/payment/status/${encodeURIComponent(orderId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("payment.not_success"));
        }

        localStorage.setItem("token", data.token);
        setUser(data.user);
        setStatus("success");
        setMessage(t("payment.success_message"));
      } catch (error) {
        setStatus("error");
        setMessage(error.message || t("payment.verify_failed"));
      }
    };

    verifyPayment();
  }, [searchParams, setUser, t]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <section className="w-full max-w-md bg-card rounded-3xl p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
            <h1 className="text-2xl font-bold mb-2">{t("payment.wait")}</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold mb-2">{t("payment.active")}</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate("/account")} className="w-full">
              {t("payment.view_account")}
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-2">{t("payment.failed")}</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate("/premium")} className="w-full">
              {t("payment.back_premium")}
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
