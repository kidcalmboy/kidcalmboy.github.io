import type { AppId } from "../game/model";
import { Messenger } from "./Messenger";
import { Files } from "./Files";
import { Photos } from "./Photos";
import { Mail, Browser, Notes } from "./Records";
import { Trash, Maps } from "./Recovery";
import { Evidence } from "./Evidence";
export function AppContent({ id, contact }: { id: AppId; contact: string }) {
  switch (id) {
    case "messenger":
      return <Messenger selected={contact} />;
    case "files":
      return <Files />;
    case "photos":
      return <Photos />;
    case "mail":
      return <Mail />;
    case "browser":
      return <Browser />;
    case "notes":
      return <Notes />;
    case "trash":
      return <Trash />;
    case "maps":
      return <Maps />;
    case "evidence":
      return <Evidence />;
  }
}
