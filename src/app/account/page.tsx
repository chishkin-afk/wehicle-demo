import { Suspense } from "react";
import Account from "@/views/account/ui/account";
import { PageLoading } from "@/shared/ui/page-loading";

export default function AccountPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Account />
    </Suspense>
  );
}
