import { OWNER_EMAIL, COMPANY_NAME } from "@/lib/constants";
import { Resend } from 'resend';
import { Order } from "@/types";
import PaymentReceiptEmail from "./payment-receipt";

const resend = new Resend(process.env.EMAIL_RESEND_API_KEY as string);

export const sendPaymentReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${COMPANY_NAME} <${OWNER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PaymentReceiptEmail order={order} />,
  });
};