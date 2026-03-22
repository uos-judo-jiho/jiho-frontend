import Logo from "@/components/Logo";
import { RegisterForm } from "@/features/user";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
        <Logo isDark size="6rem" />
        <RegisterForm />
      </div>
    </div>
  );
};
