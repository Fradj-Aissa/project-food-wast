import { getInventoryItems } from "@/lib/actions";
import InventoryClient from "./inventory-client";

export default async function InventoryPage() {
  const items = await getInventoryItems();
  return <InventoryClient items={items} />;
}
