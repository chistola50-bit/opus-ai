// app/payment/success/page.tsx
import { redirect } from 'next/navigation';

export default function PaymentSuccessPage() {
  // сразу кидаем в личный кабинет
  redirect('/dashboard');
}
