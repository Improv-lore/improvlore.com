import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import social from "./social.js";

export default async function() {

  const readIcon = (filename) => {
    try {
      const p = path.resolve("src/assets/icons", filename);
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
    } catch (e) {}
    return "";
  };

  const instagramIcon = readIcon("instagram.svg");
  const whatsappIcon = readIcon("whatsapp.svg");
  const ticketIcon = readIcon("ticket.svg");

  const items = [
    {
      id: "instagram",
      category: "social",
      categoryLabel: "Social",
      title: "Instagram",
      handle: "@improvlore",
      targetUrl: social.instagram || "https://instagram.com/improvlore",
      displayUrl: "instagram.com/improvlore",
      description: "Follow along for upcoming show announcements, behind-the-scenes reels, photos, and performer takeovers.",
      accentColor: "#E4405F",
      gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      ctaText: "Open @improvlore",
      iconSvg: instagramIcon
    },
    {
      id: "whatsapp",
      category: "social",
      categoryLabel: "Social",
      title: "WhatsApp Community",
      handle: "Improvlore Community",
      targetUrl: social.whatsapp || "https://chat.whatsapp.com/CRv3J3K0xRG8iQnTBI4hMa",
      displayUrl: "chat.whatsapp.com/CRv3J3...",
      description: "Join our vibrant Bangalore community for weekly jam alerts, workshop drops, last-minute seats, and friendly improv banter.",
      accentColor: "#25D366",
      gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
      ctaText: "Join WhatsApp Community",
      iconSvg: whatsappIcon
    },
    {
      id: "tickets",
      category: "tickets",
      categoryLabel: "Tickets & Shows",
      title: "Upcoming Events & Tickets",
      handle: "Shows, Jams & Workshops",
      targetUrl: "https://improvlore.com/events/",
      displayUrl: "improvlore.com/events",
      description: "Discover upcoming performances, open stage jams, and beginner-friendly workshops at Underline Center. Book your tickets in one tap.",
      accentColor: "#1d4ed8",
      gradient: "linear-gradient(135deg, #ffe642 0%, #f59e0b 100%)",
      ctaText: "Browse All Events & Tickets",
      iconSvg: ticketIcon,
      marathonUrl: "https://improvlore.com/marathon/",
      marathonDisplayUrl: "improvlore.com/marathon",
      marathonTitle: "All Play No Work Marathon"
    }
  ];

  for (const item of items) {
    // Generate clean vector SVG in-memory (no disk writes to prevent dev watcher loops)
    item.svg = await QRCode.toString(item.targetUrl, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111827",
        light: "#ffffff"
      }
    });
    item.svgFile = `/assets/qr/${item.id}-qr.svg`;
    item.pngFile = `/assets/qr/${item.id}-qr.png`;
  }

  // Pre-generate marathon tickets QR code SVG in-memory
  const marathonTarget = "https://improvlore.com/marathon/";
  const marathonSvg = await QRCode.toString(marathonTarget, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#111827", light: "#ffffff" }
  });

  return {
    items,
    marathon: {
      svg: marathonSvg,
      svgFile: "/assets/qr/marathon-qr.svg",
      pngFile: "/assets/qr/marathon-qr.png",
      targetUrl: marathonTarget
    }
  };
}
