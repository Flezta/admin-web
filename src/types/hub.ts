export interface HubProfile {
  name: string;
  city: string;
  address: string;
  coordinate: { lat: number; lng: number };
  timeZone: "Africa/Lagos";
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface PartnerHub extends HubProfile {
  hubId: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  subOrderCount?: number;
  accessUsers?: Array<{
    uid: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    disabled: boolean;
  }>;
  history?: Array<{
    eventId: string;
    action: string;
    actor: { uid: string; name: string };
    occurredAt: string;
    reason?: string;
    targetUid?: string;
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  }>;
}
