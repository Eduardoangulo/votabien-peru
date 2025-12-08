import { BillApprovalStatus } from "./enums";

export interface BillBase {
  number: string;
  title: string;
  title_ai: string | null;
  submission_date: string;
  approval_status: BillApprovalStatus;
  approval_date: string | null;
  document_url: string | null;
}

export interface BillBasic {
  id: string;
  number: string;
  title: string;
  title_ai: string | null;
  submission_date: string;
  approval_status: BillApprovalStatus;
  approval_date: string | null;
  document_url: string | null;
}
