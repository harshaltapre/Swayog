import { SiWhatsapp } from "react-icons/si";

export function WhatsAppOverlay() {
  const phoneNumber = "9272099152";
  const message = encodeURIComponent(
    "Hello Swayog Energy, I'm interested in solar installation.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group touch-none"
      aria-label="Chat on WhatsApp"
      data-testid="link-whatsapp-chat"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <SiWhatsapp className="w-6 h-6 sm:w-8 sm:h-8" />
      <span className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 text-white text-xs sm:text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
        Chat with us
      </span>
    </a>
  );
}
