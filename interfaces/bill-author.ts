import { BillBase } from "./bill";
import { Bill } from "@/interfaces/politics";

export interface BillAuthorBase {
  legislator_id: string;
  bill_id: string;
  role: string;
}

export interface BillAuthorBasic extends BillAuthorBase {
  bill: BillBase;
}
