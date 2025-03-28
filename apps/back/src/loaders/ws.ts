import initializeCommunicationService from "@/modules/comm/services/comm.service";
import { Server } from "http";

export default async ({ httpServer }: { httpServer: Server }) => {
  const communicationService = initializeCommunicationService(httpServer);
};
