import {
  getAvailableDonations,
  getCharities,
  getDonationsStats,
  getMyDonations,
} from "@/lib/actions";
import DonationsClient from "./donations-client";

export default async function DonationsPage() {
  const [availableDonations, charities, myDonations, stats] = await Promise.all([
    getAvailableDonations(),
    getCharities(),
    getMyDonations(),
    getDonationsStats(),
  ]);

  return (
    <DonationsClient
      availableDonations={availableDonations}
      charities={charities}
      myDonations={myDonations}
      stats={stats}
    />
  );
}
