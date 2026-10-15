import Invite from "@/views/invite/ui/invite";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <Invite token={token} />;
}
