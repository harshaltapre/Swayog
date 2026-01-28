import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Leaf,
  Sun,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { FreeQuoteModal } from "@/components/FreeQuoteModal";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] flex items-center overflow-hidden w-full">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* solar panel array on roof */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/vi.mp4" type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <img
              src="/images/industrial.jpg"
              alt="Solar Panels on Roof"
              className="w-full h-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="container-custom relative z-10 pt-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm text-sm font-medium mb-6 border border-white/10">
              <Leaf className="h-4 w-4 text-primary" />
              <span>Leading Solar Provider in India</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              <span className="text-green-600">Clean Energy.</span>
              <br />
              <span className="text-orange-400">Smart Savings.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              Switch to solar with Swayog Energy. Reduce your electricity bills by
              up to 90% and contribute to a greener planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <FreeQuoteModal>
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 w-full sm:w-auto"
                >
                  Get Free Quote
                </Button>
              </FreeQuoteModal>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm w-full"
                >
                  View Our Projects
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4 sm:gap-8 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="whitespace-nowrap">25 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="whitespace-nowrap">Subsidy Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="whitespace-nowrap">EMI Options</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
              Our Solutions
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mt-2 mb-4 text-gray-900">
              Solar Power for Every Need
            </h2>
            <p className="text-gray-600">
              Whether it's for your home, business, or industry, we provide
              customized solar solutions designed for maximum efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sun className="h-10 w-10 text-primary" />,
                title: "Residential Solar",
                desc: "Rooftop solar systems for independent houses and housing societies. Save on monthly bills.",
                img: "/images/rooftop.jpg",
              },
              {
                icon: <Zap className="h-10 w-10 text-primary" />,
                title: "Commercial Solar",
                desc: "Power your office, shop, or mall with clean energy. Avail tax benefits and reduce operational costs.",
                img: "/images/com.jpeg",
              },
              {
                icon: <Shield className="h-10 w-10 text-primary" />,
                title: "Industrial Solar",
                desc: "Large scale solar plants for factories and warehouses. High ROI and reduced carbon footprint.",
                img: "/images/industrial.jpg",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4 p-3 bg-secondary/5 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.desc}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center text-secondary font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Why Swayog Energy?
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mt-2 mb-6 text-gray-900">
                Engineering Excellence Meets Sustainable Innovation
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                We don't just install solar panels; we engineer energy
                independence. With over 10 years of experience, we guarantee
                performance and reliability.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Expert Installation Team",
                    desc: "Certified engineers ensure flawless installation.",
                  },
                  {
                    title: "Premium Quality Components",
                    desc: "Tier-1 panels and inverters with long-term warranties.",
                  },
                  {
                    title: "Lifetime Support",
                    desc: "Dedicated maintenance team for peak performance.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary-dark" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/about">
                  <Button
                    size="lg"
                    className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white"
                  >
                    More About Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
                {/* engineer checking solar panel */}
                <img
                  src="/images/img1.jpeg"
                  alt="Engineer inspecting solar panels"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 p-6 bg-white rounded-2xl shadow-xl z-20 border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500 font-medium uppercase">
                      Happy Clients
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Across residential, commercial & industrial sectors.
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-full h-full bg-primary/10 rounded-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
            Ready to Switch to Solar?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Get a customized solar proposal for your property. It's free, and
            there's no obligation.
          </p>
          <FreeQuoteModal>
            <Button
              size="lg"
              className="h-16 px-10 text-xl rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-black/20"
            >
              Get Free Consultation
            </Button>
          </FreeQuoteModal>
        </div>
      </section>
    </div>
  );
}
