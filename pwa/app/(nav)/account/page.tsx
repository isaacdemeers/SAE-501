import AccountCard from "@/components/account/accountCard";

export default async function AccountPage() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))]">
      <div className="flex justify-center w-full mt-32 mb-32 align-middle">
        <AccountCard />
      </div>
    </div>
  );
}
