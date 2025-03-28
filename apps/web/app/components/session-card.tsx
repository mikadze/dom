// packages/client/app/components/SessionCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Session } from "@repo/shared";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/session/${session.id}`);
  };

  return (
    <div
      className="p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-lg font-medium">{session.movie.title}</h3>
      <p className="text-gray-600">Hall: {session.hall.name}</p>
      <p className="text-gray-600">
        Start:{" "}
        {new Date(session.startTime).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-gray-600">
        End:{" "}
        {new Date(session.endTime).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
